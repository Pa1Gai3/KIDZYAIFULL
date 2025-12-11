

import React, { useEffect, useRef, useState } from 'react';
import {
   Wand2, Upload, Printer, PlayCircle, Star, Sparkles, Zap, Heart,
   Clock, Wallet, Shirt, Smile, CheckCircle2, XCircle, ChevronDown, ChevronUp, ShieldCheck, Camera
} from 'lucide-react';
import { THEME_CATEGORIES, User } from '../types';

interface HeroProps {
   onStart: () => void;
   user: User | null; // Added user prop
}

const Hero: React.FC<HeroProps> = ({ onStart, user }) => {

   // Flatten themes for the marquee
   const allThemes = Object.values(THEME_CATEGORIES).flat();
   const observerRef = useRef<IntersectionObserver | null>(null);
   const [openFaq, setOpenFaq] = useState<number | null>(null);

   useEffect(() => {
      observerRef.current = new IntersectionObserver((entries) => {
         entries.forEach((entry) => {
            if (entry.isIntersecting) {
               entry.target.classList.add('is-visible');
            }
         });
      }, { threshold: 0.1 });

      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observerRef.current?.observe(el));

      return () => observerRef.current?.disconnect();
   }, []);

   const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index);
   };

   const FAQS = [
      {
         q: "Is my child's photo safe?",
         a: "Absolutely. We take privacy seriously. Photos are processed securely by our AI engine solely to generate your story and are deleted from our processing servers within 24 hours. We are a compliant SaaS provider under Wayne Creative Alliance Pvt Ltd."
      },
      {
         q: "Can I print the coloring books?",
         a: "Yes! Our Premium Digital Pack (₹99) gives you a high-resolution PDF specifically designed for printing on standard A4 paper at home or your local print shop."
      },
      {
         q: "What kind of photo should I upload?",
         a: "A clear, front-facing photo works best. Avoid sunglasses, heavy shadows, or photos where the face is obstructed. Our AI is smart, but a good input ensures the best likeness!"
      },
      {
         q: "Do I need a subscription?",
         a: "No! You can pay per story (₹99). However, if you want to create many stories, our Kidzy Club subscription offers unlimited access at a huge discount."
      }
   ];

   const TESTIMONIALS = [
      {
         name: "Priya S.",
         role: "Mom of 2",
         text: "My 5-year-old hates taking photos but loves Spiderman. When he saw himself as a superhero in a coloring book, he actually screamed with joy! Best ₹99 I've ever spent.",
         avatar: "https://ui-avatars.com/api/?name=Priya+S&background=fce7f3&color=db2777"
      },
      {
         name: "Rahul M.",
         role: "Dad & Engineer",
         text: "I was skeptical about the 'likeness' claims, but it actually looks like my daughter. Saved me a fortune on a professional photoshoot for her birthday invites.",
         avatar: "https://ui-avatars.com/api/?name=Rahul+M&background=dbeafe&color=2563eb"
      },
      {
         name: "Sarah J.",
         role: "Teacher",
         text: "Used this for my kindergarten class 'Student of the Week'. The parents went absolutely crazy for it. It's such a unique, personalized gift.",
         avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=dcfce7&color=16a34a"
      }
   ];

   return (
      <div className="relative w-full overflow-hidden bg-slate-50">

         {/* SECTION 1: MAIN HERO */}
         <div
            className="relative min-h-[85vh] md:min-h-screen pt-24 md:pt-32 pb-8 md:pb-12 flex flex-col justify-center"
            style={{
               backgroundImage: "linear-gradient(to bottom, rgba(248, 250, 252, 0.9), rgba(248, 250, 252, 0.9)), url('/images/bg_1.jpg')",
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundAttachment: 'fixed',
            }}
         >

            {/* Abstract Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
               <div className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] bg-brand-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
               <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-magic-200/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
               <div className="absolute bottom-0 left-[20%] w-[50vw] h-[50vw] bg-joy-200/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

               {/* Left: Copy */}
               <div className="text-center lg:text-left reveal-on-scroll">
                  <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-3 py-1 mb-4 md:mb-8 shadow-sm animate-float scale-90 md:scale-100">
                     <span className="flex h-2 w-2 rounded-full bg-magic-500 animate-pulse"></span>
                     <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-widest">AI Storyteller for Kids</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold text-slate-900 leading-tight md:leading-[1.1] mb-4 md:mb-6">
                     Turn <span className="relative inline-block">
                        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-magic-500">Photos</span>
                        <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-joy-400 z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                           <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                        </svg>
                     </span><br />
                     into Adventures.
                  </h1>

                  <p className="text-base md:text-xl text-slate-600 mb-6 md:mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 px-2 md:px-0">
                     Upload a photo and watch as we transform your child into an Astronaut, a Wizard, or a Superhero in their very own coloring book!
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                     {/* Updated Main CTA: Upload a Pic */}
                     <button
                        onClick={onStart}
                        className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-magic-500 hover:from-brand-700 hover:to-magic-600 text-white text-lg md:text-xl px-8 py-3 md:py-5 rounded-full font-bold shadow-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 group relative overflow-hidden"
                     >
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out -skew-x-12 -translate-x-full"></div>
                        <Camera size={20} className="text-white md:w-7 md:h-7 group-hover:rotate-12 transition-transform" />
                        <span className="relative">Upload a Pic</span>
                     </button>

                     {/* Secondary Small Button */}
                     <button
                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full sm:w-auto text-slate-500 hover:text-slate-800 font-bold text-sm md:text-base px-6 py-3 rounded-full hover:bg-slate-100 transition-all flex items-center justify-center space-x-2"
                     >
                        <PlayCircle size={18} className="md:w-5 md:h-5" />
                        <span>See How It Works</span>
                     </button>
                  </div>

                  <div className="mt-6 md:mt-10 flex items-center justify-center lg:justify-start space-x-4 md:space-x-6 text-xs md:text-sm font-bold text-slate-400">
                     <span className="flex items-center"><Star size={14} className="text-joy-400 mr-1.5 md:mr-2" fill="currentColor" /> 4.9/5 Rating</span>
                     <span className="flex items-center"><Heart size={14} className="text-magic-400 mr-1.5 md:mr-2" fill="currentColor" /> 10k+ Stories</span>
                  </div>
               </div>

               {/* Right: Visual Demo (Glass Cards) */}
               <div className="relative mt-8 lg:mt-0 reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                  <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4 transform md:rotate-[-3deg] hover:rotate-0 transition duration-700 ease-out">
                     {/* Photo Input Card */}
                     <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl transform translate-y-4 md:translate-y-8">
                        <div className="aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden relative">
                           {/* --- Image to change for 'Original' --- */}
                           <img src="/images/before.jpg" alt="Child" className="w-full h-full object-cover" />
                           {/* ------------------------------------- */}
                           <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-white/90 backdrop-blur px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold text-slate-800 shadow-lg">
                              Original
                           </div>
                        </div>
                     </div>

                     {/* Generated Output Card */}
                     <div className="bg-gradient-to-br from-brand-500 to-magic-500 p-1 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl transform -translate-y-4 md:-translate-y-8">
                        <div className="bg-white p-1.5 md:p-2 rounded-[18px] md:rounded-[22px] h-full">
                           <div className="aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden relative border-2 border-slate-100">
                              {/* --- Image to change for 'Generated' (Coloring Page) --- */}
                              <img src="/images/after.png" alt="Generated" className="w-full h-full object-cover " />
                              {/* ----------------------------------------------------- */}
                              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-brand-600 text-white px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold shadow-lg flex items-center">
                                 <Sparkles size={10} className="mr-1 text-yellow-300 md:w-3 md:h-3" /> Coloring Page
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Floating Elements - Smaller on mobile */}
                  <div className="absolute -top-4 -right-4 md:-top-10 md:-right-10 bg-white p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                     <Zap size={24} className="text-joy-500 fill-current md:w-8 md:h-8" />
                  </div>
                  <div className="absolute bottom-0 -left-4 md:-left-10 bg-white p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                     <div className="text-2xl md:text-4xl">🎨</div>
                  </div>
               </div>
            </div>
         </div>

         {/* SECTION 2: TEMPLATE MARQUEE */}
         <div className="py-8 md:py-12 bg-white border-y border-slate-100 overflow-hidden relative reveal-on-scroll">
            <div className="max-w-7xl mx-auto px-4 mb-6 md:mb-8 text-center">
               <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900">Choose from <span className="text-brand-600">50+ Magical Themes</span></h2>
            </div>

            <div className="flex w-[200%] animate-scroll">
               {[...allThemes, ...allThemes].map((theme, i) => (
                  <div key={i} className="flex-shrink-0 mx-2 md:mx-3">
                     <div className="bg-slate-50 border border-slate-100 px-4 py-2 md:px-6 md:py-3 rounded-full flex items-center space-x-2 md:space-x-3 shadow-sm whitespace-nowrap">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-brand-100 to-magic-100 flex items-center justify-center text-sm md:text-lg">
                           ✨
                        </div>
                        <span className="font-bold text-slate-700 text-xs md:text-sm">{theme}</span>
                     </div>
                  </div>
               ))}
            </div>

            {/* Fade Edges */}
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
         </div>

         {/* SECTION 3: FEATURE GRID (BENTO STYLE) */}
         <div id="how-it-works" className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
               <div className="text-center mb-12 md:mb-16 reveal-on-scroll">
                  <span className="text-brand-600 font-bold tracking-wider uppercase text-xs md:text-sm">How it Works</span>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mt-2">Simple as 1, 2, 3 Magic!</h2>
               </div>

               {/* Mobile: 3 columns in a single panel, Desktop: 3 standard cards */}
               <div className="grid grid-cols-3 gap-2 md:gap-6">

                  {/* Card 1 */}
                  <div className="bg-white rounded-xl md:rounded-[2rem] p-2 md:p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition duration-500 reveal-on-scroll flex flex-col items-center text-center" style={{ transitionDelay: '0.1s' }}>
                     <div className="w-8 h-8 md:w-16 md:h-16 bg-blue-100 rounded-lg md:rounded-2xl flex items-center justify-center mb-2 md:mb-6 text-blue-600">
                        <Upload size={14} className="md:w-8 md:h-8" />
                     </div>
                     <h3 className="text-xs md:text-2xl font-bold text-slate-900 mb-1 md:mb-4">1. Upload</h3>
                     <p className="text-[10px] md:text-base text-slate-600 leading-tight md:leading-relaxed hidden sm:block">
                        Our smart "Likeness Engine" scans your photo to understand facial features.
                     </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-slate-900 rounded-xl md:rounded-[2rem] p-2 md:p-8 shadow-lg shadow-slate-900/20 text-white relative overflow-hidden hover:-translate-y-2 transition duration-500 reveal-on-scroll flex flex-col items-center text-center" style={{ transitionDelay: '0.2s' }}>
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                     <div className="w-8 h-8 md:w-16 md:h-16 bg-white/10 backdrop-blur rounded-lg md:rounded-2xl flex items-center justify-center mb-2 md:mb-6 text-yellow-300 relative z-10">
                        <Wand2 size={14} className="md:w-8 md:h-8" />
                     </div>
                     <h3 className="text-xs md:text-2xl font-bold mb-1 md:mb-4 relative z-10">2. Theme</h3>
                     <p className="text-[10px] md:text-base text-slate-300 leading-tight md:leading-relaxed relative z-10 hidden sm:block">
                        Pick from Space, Dinosaurs, Princesses, and more.
                     </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded-xl md:rounded-[2rem] p-2 md:p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition duration-500 reveal-on-scroll flex flex-col items-center text-center" style={{ transitionDelay: '0.3s' }}>
                     <div className="w-8 h-8 md:w-16 md:h-16 bg-green-100 rounded-lg md:rounded-2xl flex items-center justify-center mb-2 md:mb-6 text-green-600">
                        <Printer size={14} className="md:w-8 md:h-8" />
                     </div>
                     <h3 className="text-xs md:text-2xl font-bold text-slate-900 mb-1 md:mb-4">3. Color</h3>
                     <p className="text-[10px] md:text-base text-slate-600 leading-tight md:leading-relaxed hidden sm:block">
                        Get a high-quality PDF storybook or order a hardcover keepsake.
                     </p>
                  </div>

               </div>
            </div>
         </div>

         {/* SECTION 4: BENEFITS / COMPARISON */}
         <div className="py-12 md:py-24 bg-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-brand-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
               <div className="text-center mb-8 md:mb-16 reveal-on-scroll">
                  <span className="text-brand-600 font-bold tracking-wider uppercase text-[10px] md:text-sm">Why Parents Love Us</span>
                  <h2 className="text-2xl md:text-5xl font-display font-bold text-slate-900 mt-1 md:mt-2">Skip the Studio Struggle</h2>
               </div>

               <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center reveal-on-scroll">

                  {/* Left: Traditional (The Bad) */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-10 grayscale-[0.8] opacity-80 hover:grayscale-0 hover:opacity-100 transition duration-500">
                     <h3 className="text-lg md:text-2xl font-bold text-slate-600 mb-4 md:mb-6 flex items-center">
                        <XCircle className="mr-2 md:mr-3 text-slate-400 w-5 h-5 md:w-auto md:h-auto" /> Traditional Shoot
                     </h3>
                     <ul className="space-y-3 md:space-y-4">
                        <li className="flex items-center text-slate-500 text-sm md:text-base">
                           <Wallet className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5" /> Expensive (₹15,000+)
                        </li>
                        <li className="flex items-center text-slate-500 text-sm md:text-base">
                           <Clock className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5" /> Takes hours (travel + shoot)
                        </li>
                        <li className="flex items-center text-slate-500 text-sm md:text-base">
                           <Shirt className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5" /> Buying/Renting costly costumes
                        </li>
                     </ul>
                  </div>

                  {/* Right: KidzyColor (The Good) */}
                  <div className="bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-2xl shadow-brand-500/20 transform md:scale-105 relative">
                     <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-bl-xl rounded-tr-xl md:rounded-tr-3xl">WINNER</div>
                     <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
                        <CheckCircle2 className="mr-2 md:mr-3 text-yellow-300 w-5 h-5 md:w-auto md:h-auto" /> KidzyColor Magic
                     </h3>
                     <ul className="space-y-3 md:space-y-4 font-medium">
                        <li className="flex items-center text-sm md:text-base">
                           <Wallet className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5 text-brand-200" /> Affordable (Free to try)
                        </li>
                        <li className="flex items-center text-sm md:text-base">
                           <Clock className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5 text-brand-200" /> Ready in seconds from home
                        </li>
                        <li className="flex items-center text-sm md:text-base">
                           <Shirt className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5 text-brand-200" /> Any costume you can imagine
                        </li>
                     </ul>
                  </div>

               </div>
            </div>
         </div>

         {/* SECTION 5: TESTIMONIALS */}
         <div className="py-12 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
               <div className="text-center mb-8 md:mb-12 reveal-on-scroll">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                     {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400 md:w-4 md:h-4" />)}
                  </div>
                  <h2 className="text-2xl md:text-5xl font-display font-bold text-slate-900">Loved by 10,000+ Parents</h2>
               </div>

               {/* Horizontal scroll on mobile */}
               <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar reveal-on-scroll">
                  {TESTIMONIALS.map((t, i) => (
                     <div key={i} className="min-w-[85vw] md:min-w-0 snap-center bg-white p-5 md:p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col h-full">
                        <div className="flex items-center mb-3 md:mb-4">
                           <img src={t.avatar} alt={t.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3" />
                           <div>
                              <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                              <p className="text-xs text-slate-500">{t.role}</p>
                           </div>
                           <ShieldCheck className="ml-auto text-green-500 w-4 h-4" />
                        </div>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed flex-1">"{t.text}"</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* SECTION 6: FAQ */}
         <div className="py-12 md:py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
               <div className="text-center mb-8 md:mb-12 reveal-on-scroll">
                  <span className="text-brand-600 font-bold tracking-wider uppercase text-[10px] md:text-sm">Got Questions?</span>
                  <h2 className="text-2xl md:text-5xl font-display font-bold text-slate-900 mt-1 md:mt-2">Frequently Asked</h2>
               </div>

               <div className="space-y-3 md:space-y-4 reveal-on-scroll">
                  {FAQS.map((faq, i) => (
                     <div key={i} className="border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden">
                        <button
                           onClick={() => toggleFaq(i)}
                           className="w-full flex items-center justify-between p-4 md:p-6 bg-slate-50 hover:bg-slate-100 transition text-left"
                        >
                           <span className="font-bold text-slate-900 text-sm md:text-lg pr-4">{faq.q}</span>
                           {openFaq === i ? <ChevronUp className="text-slate-500 flex-shrink-0" /> : <ChevronDown className="text-slate-500 flex-shrink-0" />}
                        </button>
                        {openFaq === i && (
                           <div className="p-4 md:p-6 bg-white border-t border-slate-100 text-slate-600 text-xs md:text-base leading-relaxed">
                              {faq.a}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* SECTION 7: FINAL CTA */}
         <div className="py-12 md:py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-900 to-slate-900 opacity-90"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center reveal-on-scroll">
               <h2 className="text-3xl md:text-6xl font-display font-bold mb-4 md:mb-6">Ready to create magic?</h2>
               <p className="text-slate-300 text-base md:text-xl mb-6 md:mb-10 max-w-2xl mx-auto">
                  Join thousands of happy parents making storytime unforgettable. No credit card required to start.
               </p>

               {user ? (
                  <button
                     onClick={onStart}
                     className="bg-brand-500 hover:bg-brand-600 text-white text-lg md:text-xl px-10 py-4 md:py-5 rounded-full font-bold shadow-xl shadow-brand-500/30 transition transform hover:-translate-y-1 inline-flex items-center space-x-2"
                  >
                     <Wand2 className="text-yellow-300" />
                     <span>Create Your Story Now</span>
                  </button>
               ) : (
                  <button
                     onClick={onStart} // Will trigger login via App.tsx handler
                     className="bg-white text-slate-900 hover:bg-slate-100 text-lg md:text-xl px-10 py-4 md:py-5 rounded-full font-bold shadow-xl transition transform hover:-translate-y-1 inline-flex items-center space-x-2"
                  >
                     <span>Start for Free</span>
                  </button>
               )}

               <p className="mt-6 text-xs md:text-sm text-slate-500 font-medium">
                  Secure • Private • Satisfaction Guaranteed
               </p>
            </div>
         </div>

      </div>
   );
};

export default Hero;
