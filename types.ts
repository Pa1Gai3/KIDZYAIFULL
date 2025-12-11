
export const THEME_CATEGORIES = {
  "Fantasy & Magic": [
    "Space Explorer", "Dragon Rider", "Fairy Princess", "Wizard Apprentice",
    "Mermaid/Merman", "Unicorn Keeper", "Forest Elf", "Royal Knight",
    "Cloud Walker", "Time Traveler"
  ],
  "Professions": [
    "Astronaut", "Doctor", "Firefighter", "Pilot", "Chef", "Scientist",
    "Veterinarian", "Detective", "Construction Builder", "Teacher",
    "Artist", "Musician", "F1 Driver"
  ],
  "Sports & Action": [
    "Cricket Captain", "Football Star", "Gymnast", "Ninja Warrior",
    "Super Hero", "Archer", "Scuba Diver", "Mountain Climber",
    "Skateboarder", "Karate Master"
  ],
  "History & Culture": [
    "Maharaja/Maharani", "Viking Warrior", "Egyptian Pharaoh", "Samurai",
    "Cowboy/Cowgirl", "Pirate Captain", "Greek God/Goddess", "Explorer"
  ],
  "Nature & Animals": [
    "Jungle King/Queen", "Dinosaur Tamer", "Wolf Pack Leader", "Eagle Flyer",
    "Ocean Guardian", "Safari Ranger", "Butterfly Whisperer"
  ]
};

export enum PaperSize {
  SQUARE = 'Square (1:1)',
  A4_PORTRAIT = 'A4 Portrait',
  A4_LANDSCAPE = 'A4 Landscape',
  MOBILE_STORY = 'Mobile Story (9:16)'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface SavedStory {
  id: string;
  userId: string;
  title: string;
  coverUrl: string;
  createdAt: number;
  storyData: Story;
  paperSize?: PaperSize; // Deprecated in favor of config
  config: StoryConfig;
  isPurchased?: boolean;
}

export interface SavedPhoto {
  id: string;
  userId: string;
  url: string;
  prompt: string;
  theme: string;
  createdAt: number;
}

export interface StoryConfig {
  childName: string;
  age: number;
  gender: string;
  theme: string;
  paperSize: PaperSize;
  buddyName?: string;
  buddyType?: string;
  description: string;
  photoBase64?: string;
  avatarUrl?: string;
}

export interface StoryPage {
  id: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  referenceImageUrl?: string;
  isLoadingImage: boolean;
  isCover?: boolean;
}

export interface Story {
  title: string;
  pages: StoryPage[];
}

export interface GalleryItem {
  id: string;
  url?: string;
  prompt: string;
  isLoading: boolean;
  label: string;
}

export enum AppState {
  LANDING,
  LOGIN,
  SIGNUP,
  DASHBOARD,
  CONFIG,
  STORY_VIEW,
  PHOTOSHOOT_GALLERY,
  PRICING,
  INFO_PAGE
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}
