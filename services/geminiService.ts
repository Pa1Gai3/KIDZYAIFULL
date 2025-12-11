
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { StoryConfig, Story, PaperSize, StoryPage } from "../types";

// PROD_READY: Use Vite environment variable. 
// intended for client-side usage in MVP. For strict production security, 
// this should be moved to a backend proxy (e.g. Firebase Functions).
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing VITE_GEMINI_API_KEY. Please add it to your .env file.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "dummy_key_for_build" });

// Permissive safety settings to allow fantasy character transformations
// while still blocking actual explicit or dangerous content.
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

// Helper to map PaperSize to Aspect Ratio
const getAspectRatio = (size: PaperSize): string => {
  switch (size) {
    case PaperSize.A4_PORTRAIT: return '3:4';
    case PaperSize.A4_LANDSCAPE: return '4:3';
    case PaperSize.MOBILE_STORY: return '9:16';
    case PaperSize.SQUARE:
    default: return '1:1';
  }
};

// Helper to extract base64 data and mime type
const getBase64Details = (base64String: string) => {
  // Regex to capture mime type and the data part
  const matches = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return { mimeType: matches[1], data: matches[2] };
  }
  // Fallback: assume jpeg if no header found, but clean up if it exists in a different format we didn't catch
  const cleanedData = base64String.replace(/^data:image\/\w+;base64,/, '');
  return { mimeType: 'image/jpeg', data: cleanedData };
};

const fetchImageAsBase64 = async (url: string): Promise<{ mimeType: string, data: string }> => {
  if (url.startsWith('data:')) {
    return getBase64Details(url);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(getBase64Details(base64String));
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Failed to fetch remote image (likely CORS issue). Using placeholder/skipping.", error);
    // Return a safe fallback or allow the caller to handle it. 
    // For generation, returning null data might be handled better by the caller checking it.
    // For now, returning empty will likely cause downstream 'empty image' error, but safer than crash.
    // Ideally, we re-throw so the caller knows to skip the reference image.
    throw error;
  }
};

/**
 * Invisible Step: Analyze the image to get physical description
 * using Gemini 2.5 Flash (Multimodal)
 */
const analyzeImageFeatures = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const prompt = "Analyze this image of a child. Describe their physical appearance in detail to help an artist draw a portrait. Focus on: Hair style/color, Eye color, Skin tone, Facial structure, and distinct features. Return a concise comma-separated list of traits.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Image } },
          { text: prompt }
        ]
      }
    });
    return response.text || "A happy child";
  } catch (e) {
    console.warn("Analysis failed", e);
    // Fallback
    return "A happy child";
  }
}

/**
 * Step 1: The "Photoshoot"
 * Converts the uploaded photo into a realistic character avatar.
 * Falls back to text-to-image if image-to-image is blocked.
 */
export const generateRealisticAvatar = async (config: StoryConfig): Promise<{ imageUrl: string, description: string }> => {
  if (!config.photoBase64) throw new Error("Photo required for magic photoshoot");

  const { mimeType, data: base64Data } = getBase64Details(config.photoBase64);

  // Step 1: Analyze
  // We do this first so we have the description for the fallback if needed.
  const analyzedDescription = await analyzeImageFeatures(base64Data, mimeType);

  // Step 2: Try Image-to-Image Generation
  try {
    const prompt = `
        Transform this photo into a cinematic fantasy portrait.
        Subject: A ${config.age} year old ${config.gender}.
        Physical Description: ${analyzedDescription}.
        Costume/Theme: ${config.theme}.
        Style: High quality, movie poster style, cinematic lighting, highly detailed.
        IMPORTANT: Preserve the facial features and likeness of the child in the input image as much as possible, while integrating them into the fantasy theme.
      `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1'
        },
        safetySettings: SAFETY_SETTINGS
      }
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (imageUrl) {
      return { imageUrl, description: analyzedDescription };
    }

    console.warn("Gemini returned no image (likely safety block). Switching to fallback.");

  } catch (error) {
    console.warn("Image-to-image generation failed. Switching to fallback.", error);
  }

  // Step 3: Fallback (Text-to-Image)
  // If we reach here, either the API errored or returned no image.
  // We use the analyzed description to generate a new image from scratch.

  console.debug("Attempting fallback generation with description:", analyzedDescription);

  const fallbackPrompt = `
    Cinematic studio photoshoot of a ${config.age} year old ${config.gender}.
    Character Description: ${analyzedDescription}.
    Costume: ${config.theme}.
    Style: High-end photography, 8k resolution, cinematic lighting, photorealistic, highly detailed, Disney-Pixar realism.
    Pose: Confident and heroic.
  `;

  const fallbackResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: fallbackPrompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: '1:1'
      },
      safetySettings: SAFETY_SETTINGS
    }
  });

  let fallbackImageUrl = '';
  for (const part of fallbackResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      fallbackImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!fallbackImageUrl) {
    throw new Error("Failed to generate avatar image (Both primary and fallback methods failed).");
  }

  return { imageUrl: fallbackImageUrl, description: analyzedDescription };
};

/**
 * Step 2: Generate Story Outline
 * Generates the text content and image prompts for the story.
 */
export const generateStoryOutline = async (config: StoryConfig): Promise<Story> => {
  const prompt = `
    Create a fun, engaging children's story (exactly 5 pages) for a ${config.age} year old ${config.gender} named ${config.childName}.
    Theme: ${config.theme}.
    Buddy: ${config.buddyName ? `Sidekick named ${config.buddyName} (${config.buddyType})` : 'A magical friend'}.
    
    Structure the story in exactly 5 pages with this narrative arc:
    Page 1: The Hook/Introduction (Setting the scene and introducing the character).
    Page 2: The Adventure Begins (Something magical or exciting happens).
    Page 3: The Challenge (A small puzzling moment or fun obstacle).
    Page 4: The Climax (Solving the problem with the buddy).
    Page 5: Happy Ending (Success and celebration).

    STYLE: The text should be "bubbly", fun, rhythmic, and simple for a child to read. Use excitement!
    
    For each page, provide:
    1. The story text (2-3 sentences max).
    2. A simple visual description of actions and setting (focus on main character, minimize background clutter).
    
    Structure the response as a valid JSON object matching the schema.
    `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                text: { type: Type.STRING },
                sceneDescription: { type: Type.STRING }
              },
              required: ['id', 'text', 'sceneDescription']
            }
          }
        },
        required: ['title', 'pages']
      }
    }
  });

  const storyData = JSON.parse(response.text || '{}');

  // Cover Page - Uses the avatar generated in Step 1 as the cover image
  const coverPage: StoryPage = {
    id: 0,
    text: storyData.title,
    imagePrompt: `Cover art for a children's book titled "${storyData.title}". Theme: ${config.theme}. Character: ${config.description}. Style: Vibrant, colorful, Disney-Pixar style.`,
    imageUrl: config.avatarUrl, // Use the avatar as cover
    isLoadingImage: false,
    isCover: true
  };

  // Story Pages
  const pages: StoryPage[] = (storyData.pages || []).map((p: any, index: number) => ({
    id: index + 1,
    text: p.text,
    imagePrompt: p.sceneDescription, // Neutral description of the scene
    isLoadingImage: true,
    isCover: false
  }));

  return {
    title: storyData.title,
    pages: [coverPage, ...pages]
  };
};

/**
 * Generate Image for a Story Page (Line Art + Color Reference)
 * SERIALLY to save credits and ensure quality.
 * Uses the Reference Image (Avatar) for strict character consistency.
 */
export const generatePageImage = async (sceneDescription: string, paperSize: PaperSize, characterDescription: string, referenceImageUrl?: string): Promise<{ lineArt: string, coloredReference: string }> => {
  const aspectRatio = getAspectRatio(paperSize);

  // Parse reference image if provided
  let referencePart = null;
  if (referenceImageUrl) {
    const { mimeType, data } = await fetchImageAsBase64(referenceImageUrl);
    referencePart = { inlineData: { mimeType, data } };
  }

  // 1. Generate Line Art (Simple, Bold, No Shading)
  // We use the reference image to keep the character consistent
  const lineArtPrompt = `
      Create a CHILDREN'S COLORING PAGE based on this scene.
      Scene: ${sceneDescription}.
      Character: ${characterDescription} (Adapt the reference character into this style).
      
      STRICT VISUAL STYLE:
      - THICK, BOLD, CLEAN black outlines only.
      - NO SHADING, NO TEXTURE, NO GRAYSCALE, NO HATCHING.
      - SIMPLE CARTOON STYLE (like a Disney junior coloring book).
      - Minimal background (focus on the character).
      - White background.
  `;

  const lineArtParts = referencePart ? [referencePart, { text: lineArtPrompt }] : [{ text: lineArtPrompt }];

  console.debug("Generating Line Art...");
  const lineArtRes = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: lineArtParts },
    config: {
      imageConfig: { aspectRatio: aspectRatio as any },
      safetySettings: SAFETY_SETTINGS
    }
  });

  const getUrl = (response: any) => {
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return '';
  };

  return {
    lineArt: getUrl(lineArtRes),
    coloredReference: "" // Skip generating color reference per page
  };
};

/**
 * Colorize a line art image using a reference avatar for consistency.
 */
export const generateColorizedImage = async (lineArtUrl: string, avatarUrl: string, description: string): Promise<string> => {
  const { mimeType: lineMime, data: lineData } = await fetchImageAsBase64(lineArtUrl);
  const { mimeType: avMime, data: avData } = await fetchImageAsBase64(avatarUrl);

  const prompt = `
      Color this line art image (first image).
      Use the character reference (second image) to match colors/style perfectly.
      Style: Vibrant 3D animated movie style, Pixar style, high quality, cinematic lighting.
      Keep the composition and lines of the first image exactly as they are, just add color.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: lineMime, data: lineData } }, // Line Art
        { inlineData: { mimeType: avMime, data: avData } },     // Reference Avatar
        { text: prompt }
      ]
    },
    config: {
      imageConfig: { aspectRatio: '1:1' }, // Default square for grid
      safetySettings: SAFETY_SETTINGS
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return '';
};

/**
 * Generate Gallery Variation
 */
export const generateImageVariation = async (config: StoryConfig, promptSuffix: string): Promise<string> => {
  if (!config.photoBase64) throw new Error("Photo required");

  // We try to use the image input if possible, but use description as backup logic could be applied here too.
  // For now, sticking to image input as gallery variations should strictly follow the original image if possible.
  // But if the previous step failed and fell back, we might be sending a photo that causes failure again.
  // However, let's keep it simple for now and just improve error handling or just use text if we want to be safe.

  const { mimeType, data: base64Data } = getBase64Details(config.photoBase64);

  const fullPrompt = `
      Photoshoot session continued.
      Subject: A ${config.age} year old ${config.gender}, described as ${config.description}.
      Theme: ${config.theme}.
      Specific Shot: ${promptSuffix}.
      Style: High-end photography, 8k resolution, cinematic lighting, photorealistic.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: fullPrompt }
        ]
      },
      config: {
        imageConfig: { aspectRatio: '1:1' }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.warn("Variation generation failed with image. Trying text-only fallback.");
  }

  // Fallback for variation
  const fallbackResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }]
    },
    config: {
      imageConfig: { aspectRatio: '1:1' }
    }
  });

  for (const part of fallbackResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate image variation");
};
