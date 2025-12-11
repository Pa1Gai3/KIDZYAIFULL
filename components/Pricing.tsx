
import React from 'react';
import { Check, Star, Gift, Building2 } from 'lucide-react';
import { PricingTier } from '../types';

const tiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Preview',
    price: 'Free',
    features: ['1 Free "Photoshoot" Preview', 'Watermarked Portrait', 'No High-Res Download'],
    cta: 'Try Now'
  },
  {
    id: 'pay-per',
    name: 'Digital Pack',
    price: '₹99',
    features: ['High-Res PDF Storybook', 'Unlocks All Gallery Photos', 'Print-Ready Quality (300 DPI)', 'No Watermarks'],
    isPopular: true,
    cta: 'Buy Now'
  },
  {
    id: 'sub',
    name: 'Kidzy Club',
    price: '₹499/yr',
    features: ['Unlimited Downloads', 'Access to All Themes', 'Priority Fast Processing', 'Cancel Anytime'],
    cta: 'Join Club'
  },
  {
    id: 'print',
    name: 'Hardcover',
    price: '₹1,499',
    features: ['Physical Hardcover Book', 'Delivered to your Door', 'Includes Digital Copy', 'Premium Paper'],
    cta: 'Order Print'
  }
];

interface PricingProps {
  onBack: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onBack }) => {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold text-brand-900 mb-4">Simple, Affordable Pricing</h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Get high-quality, print-ready memories of your child's adventures for less than the cost of a coffee.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <div 
            key={tier.id} 
            className={`relative rounded-2xl p-6 flex flex-col ${
              tier.isPopular 
                ? 'bg-white border-2 border-brand-500 shadow-xl scale-105 z-10' 
                : 'bg-white border border-slate-200 shadow-md'
            }`}
          >
            {tier.isPopular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                <Star size={14} className="mr-1 fill-current" /> Best Value
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-slate-600">
                  <Check size={18} className="mr-2 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 rounded-xl font-bold transition ${
              tier.isPopular 
                ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-200' 
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}>
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-8">
        <div className="bg-indigo-50 rounded-2xl p-8 flex items-start space-x-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Schools & Education</h3>
            <p className="text-slate-600 mb-4">
              Generate "Classroom Hero" coloring sheets for the whole class. Bulk discounts available for teachers.
            </p>
            <button className="text-indigo-600 font-bold hover:underline">Contact Sales</button>
          </div>
        </div>

        <div className="bg-purple-50 rounded-2xl p-8 flex items-start space-x-4">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
            <Gift size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">Birthday Party Packs</h3>
            <p className="text-slate-600 mb-4">
              The ultimate party favor! Personalized 5-page mini-books for 10+ kids.
            </p>
            <button className="text-purple-600 font-bold hover:underline">View Party Packs</button>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
         <button onClick={onBack} className="text-slate-500 hover:text-slate-700">Back to Home</button>
      </div>
    </div>
  );
};

export default Pricing;
