
import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle, CreditCard, Lock } from 'lucide-react';

interface PaymentModalProps {
  itemLabel: string;
  price: number;
  onClose: () => void;
  onSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ itemLabel, price, onClose, onSuccess }) => {
  const [step, setStep] = useState<'SUMMARY' | 'SUCCESS'>('SUMMARY');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleRazorpay = () => {
    setIsProcessing(true);
    
    const options = {
      key: "rzp_test_Rn2uglCRjaNGD1",
      amount: price * 100, // Amount is in currency subunits. Default currency is INR.
      currency: "INR",
      name: "Wayne Creative Alliance Pvt Ltd",
      description: itemLabel,
      image: "https://ui-avatars.com/api/?name=Kidzy+Color&background=8b5cf6&color=fff", // Placeholder logo
      handler: function (response: any) {
        console.log("Payment Successful", response);
        setStep('SUCCESS');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      },
      prefill: {
        name: "", // Can be prefilled if user info is passed
        email: "",
        contact: ""
      },
      theme: {
        color: "#8b5cf6"
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any){
          alert("Payment Failed: " + response.error.description);
          setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay Error", error);
      alert("Something went wrong initializing payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-700 font-bold">
             <ShieldCheck size={18} className="text-green-500" />
             <span className="text-sm">Secure Checkout</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          
          {step === 'SUMMARY' && (
            <>
              <div className="mb-8 text-center">
                <p className="text-slate-500 text-sm uppercase tracking-wide font-bold mb-1">Purchase Summary</p>
                <h3 className="text-2xl font-display font-bold text-slate-900">{itemLabel}</h3>
                <div className="mt-4 text-4xl font-bold text-brand-600">₹{price}</div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-sm text-slate-600">
                 <div className="flex justify-between mb-2">
                   <span>Subtotal</span>
                   <span>₹{price}</span>
                 </div>
                 <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                   <span>Total Due</span>
                   <span>₹{price}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <button 
                   onClick={handleRazorpay}
                   disabled={isProcessing}
                   className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 transition transform active:scale-95 flex justify-center items-center"
                 >
                   {isProcessing ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                        Processing...
                      </>
                   ) : (
                      <>
                        <CreditCard className="mr-2" size={20} />
                        Pay with Razorpay
                      </>
                   )}
                 </button>
                 
                 <div className="text-center">
                   <p className="text-[10px] text-slate-400 flex items-center justify-center">
                     <Lock size={10} className="mr-1" />
                     Payments processed securely by Razorpay for Wayne Creative Alliance Pvt Ltd.
                   </p>
                 </div>
              </div>
            </>
          )}

          {step === 'SUCCESS' && (
             <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <CheckCircle size={40} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Payment Successful!</h3>
                <p className="text-slate-500 mt-2">Unlocking your magical content...</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
