
import React from 'react';
import { ArrowLeft, Mail, Building2, Shield, FileText, HelpCircle, Info } from 'lucide-react';

interface InfoPageProps {
  pageKey: string;
  onBack: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ pageKey, onBack }) => {
  
  const renderContent = () => {
    switch (pageKey) {
      case 'privacy':
        return (
          <>
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="text-green-500" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
                <p className="text-sm text-slate-500">Provided by Wayne Creative Alliance Pvt Ltd</p>
              </div>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base">
              <p className="mb-4"><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
              
              <p>
                <strong>KidzyColor</strong> ("Service") is an AI-powered storybook generation platform operated by <strong>Wayne Creative Alliance Pvt Ltd</strong> ("Company", "we", "us", or "our"). 
                We are committed to protecting the privacy of our users ("you"), especially regarding the sensitive nature of children's images.
              </p>
              
              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">1. Information We Collect</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, and authentication data provided via Google Sign-In.</li>
                <li><strong>User Content:</strong> Photos uploaded for processing and text inputs (names, descriptions).</li>
                <li><strong>Generated Content:</strong> AI-generated images and stories created through the Service.</li>
              </ul>
              
              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">2. How We Process Images (AI & Third Parties)</h3>
              <p>
                To provide our Service, uploaded photos are processed using advanced Artificial Intelligence models (specifically Google Gemini API). 
                <strong>Wayne Creative Alliance Pvt Ltd</strong> does not use your personal photos to train public AI models. 
                Images are processed ephemerally to generate the requested stylized avatar and story.
              </p>
              
              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">3. Data Retention</h3>
              <p>
                <strong>Uploads:</strong> Original photos uploaded for generation are automatically deleted from our processing servers within 24 hours after the session is complete.
                <br/>
                <strong>Library:</strong> Generated stories and stylized avatars are stored securely in your private User Library until you choose to delete them or delete your account.
              </p>
              
              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">4. Data Security</h3>
              <p>We implement industry-standard security measures, including encryption in transit and at rest, to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
              
              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">5. Contact Us</h3>
              <p>For privacy-related inquiries regarding KidzyColor, please contact Wayne Creative Alliance Pvt Ltd.</p>
            </div>
          </>
        );
      
      case 'terms':
        return (
          <>
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="text-blue-500" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
                <p className="text-sm text-slate-500">Legal Agreement with Wayne Creative Alliance Pvt Ltd</p>
              </div>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base">
              <p>
                These Terms of Service ("Terms") govern your access to and use of <strong>KidzyColor</strong>, a SaaS product provided by <strong>Wayne Creative Alliance Pvt Ltd</strong>.
              </p>
              
              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">1. AI Technology Disclaimer</h3>
              <p>
                KidzyColor uses generative artificial intelligence. By using the Service, you acknowledge that:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>AI outputs are probabilistic and may occasionally produce inaccurate, unexpected, or offensive results.</li>
                <li>Wayne Creative Alliance Pvt Ltd does not guarantee that the generated likeness will be 100% accurate to the uploaded photo.</li>
                <li>You are responsible for reviewing all generated content before sharing or printing.</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">2. User Conduct & Acceptable Use</h3>
              <p>You agree NOT to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Upload images of any person for whom you do not have legal rights or parental consent.</li>
                <li>Upload content that is illegal, harmful, threatening, abusive, or sexually explicit.</li>
                <li>Use the generated content for unlawful purposes.</li>
              </ul>
              <p>Wayne Creative Alliance Pvt Ltd reserves the right to ban any user found violating these terms without refund.</p>

              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">3. Intellectual Property</h3>
              <p>
                <strong>Your Content:</strong> You retain ownership of the photos you upload.
                <br/>
                <strong>Generated Assets:</strong> Upon payment (if applicable), Wayne Creative Alliance Pvt Ltd grants you a perpetual, non-exclusive, worldwide license to use, display, and print the AI-generated stories and images for personal, non-commercial use.
              </p>
              
              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">4. Limitation of Liability</h3>
              <p className="uppercase text-xs font-bold tracking-wider text-slate-500 mb-2">Read Carefully</p>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WAYNE CREATIVE ALLIANCE PVT LTD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; OR (C) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
              </p>
              
              <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">5. Refund Policy</h3>
              <p>Due to the significant GPU costs associated with AI generation, all sales are final. Refunds are only provided in the event of a proven technical failure where the Service did not deliver the generated output.</p>
            </div>
          </>
        );

      case 'schools':
        return (
          <>
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="text-indigo-500" size={32} />
              <h1 className="text-3xl font-bold text-slate-900">For Schools & Educators</h1>
            </div>
            <p className="text-xl text-slate-600 mb-8">Spark creativity in your classroom with personalized learning materials powered by Wayne Creative Alliance Pvt Ltd.</p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Bulk Licensing</h3>
                <p className="text-slate-600">Get a school-wide license to generate "Classroom Hero" stories for every student. Perfect for end-of-year gifts or creative writing prompts.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <h3 className="text-xl font-bold text-purple-900 mb-2">Privacy First Mode</h3>
                <p className="text-slate-600">Our educational plan includes a special "Zero-Retention" mode where no data is saved to servers after generation, ensuring full compliance with educational data standards.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
              <h3 className="text-lg font-bold mb-2">Interested in a pilot program?</h3>
              <p className="text-slate-500 mb-4">Contact our education team for a demo.</p>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700">Contact Sales</button>
            </div>
          </>
        );

      case 'help':
        return (
          <>
            <div className="flex items-center space-x-3 mb-6">
              <HelpCircle className="text-orange-500" size={32} />
              <h1 className="text-3xl font-bold text-slate-900">Help Center</h1>
            </div>
            
            <div className="space-y-6">
               <div className="bg-white border border-slate-200 rounded-xl p-6">
                 <h3 className="font-bold text-lg text-slate-900 mb-2">About KidzyColor</h3>
                 <p className="text-slate-600">KidzyColor is an AI-powered SaaS product developed and maintained by <strong>Wayne Creative Alliance Pvt Ltd</strong>. We combine cutting-edge Generative AI with storytelling to create magical experiences for families.</p>
               </div>

               <div className="bg-white border border-slate-200 rounded-xl p-6">
                 <h3 className="font-bold text-lg text-slate-900 mb-2">Why does the generation take time?</h3>
                 <p className="text-slate-600">We use advanced AI models to analyze features and generate high-resolution images. This "thinking" and "drawing" process typically takes 15-30 seconds to ensure the best quality.</p>
               </div>

               <div className="bg-white border border-slate-200 rounded-xl p-6">
                 <h3 className="font-bold text-lg text-slate-900 mb-2">My download didn't start. What do I do?</h3>
                 <p className="text-slate-600">If you purchased a download but didn't receive the file, check your "My Library" (Dashboard). All unlocked stories and photos are saved there forever.</p>
               </div>

               <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start space-x-4 bg-slate-50">
                 <Info className="text-slate-400 mt-1 shrink-0" />
                 <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Company Information</h3>
                    <p className="text-slate-600 text-sm">
                        <strong>Wayne Creative Alliance Pvt Ltd</strong><br/>
                        SaaS & Marketing Agency<br/>
                        For legal inquiries: legal@waynecreative.com
                    </p>
                 </div>
               </div>
            </div>
          </>
        );

      case 'contact':
        return (
          <>
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="text-brand-500" size={32} />
              <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-2xl">
               <p className="text-slate-600 mb-6">Have a question about your order or a feature request? We'd love to hear from you. KidzyColor is a product of Wayne Creative Alliance Pvt Ltd.</p>
               
               <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent! We will get back to you shortly."); }}>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                   <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                   <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                   <textarea rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"></textarea>
                 </div>
                 <button className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 w-full">Send Message</button>
               </form>
            </div>
          </>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[60vh]">
       <button 
         onClick={onBack}
         className="flex items-center text-slate-500 hover:text-slate-900 font-medium mb-8 transition"
       >
         <ArrowLeft size={20} className="mr-2" />
         Back to Home
       </button>
       
       <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          {renderContent()}
       </div>
    </div>
  );
};

export default InfoPage;
