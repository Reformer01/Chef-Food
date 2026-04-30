import { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Loader2, Lock } from 'lucide-react';

// CONFIGURATION: Replace with your Paystack public key
// Get your key from: https://dashboard.paystack.com/#/settings/developer
const PAYSTACK_PUBLIC_KEY = 'pk_test_your_paystack_public_key_here';

interface PaystackPaymentProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export default function PaystackPayment({ amount, email, onSuccess, onClose }: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaystackPayment = async () => {
    if (PAYSTACK_PUBLIC_KEY === 'pk_test_your_paystack_public_key_here') {
      setError('Paystack not configured. Please add your public key.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Load Paystack script dynamically
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => {
        const handler = (window as any).PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: email,
          amount: amount * 100, // Paystack amount is in kobo (100 kobo = 1 Naira)
          currency: 'NGN',
          ref: 'CL_' + Math.floor(Math.random() * 1000000000),
          metadata: {
            custom_fields: [
              {
                display_name: 'Order From',
                variable_name: 'order_from',
                value: 'ChopLife Website'
              }
            ]
          },
          callback: function(response: any) {
            setIsProcessing(false);
            onSuccess(response.reference);
          },
          onClose: function() {
            setIsProcessing(false);
            onClose();
          }
        });
        handler.openIframe();
      };

      script.onerror = () => {
        setIsProcessing(false);
        setError('Failed to load Paystack. Please try again.');
      };

      document.body.appendChild(script);
    } catch (err) {
      setIsProcessing(false);
      setError('Payment initialization failed. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Methods */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          onClick={handlePaystackPayment}
          disabled={isProcessing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 p-4 bg-[#00C3F7] hover:bg-[#00B4E8] text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay with Card
            </>
          )}
        </motion.button>

        <motion.button
          onClick={handlePaystackPayment}
          disabled={isProcessing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 p-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span className="text-lg">📱</span>
              USSD/Bank
            </>
          )}
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Configuration Notice */}
      {PAYSTACK_PUBLIC_KEY === 'pk_test_your_paystack_public_key_here' && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-xs">
          <strong>Demo Mode:</strong> Add your Paystack public key in PaystackPayment.tsx to accept real payments.
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
        <Lock className="w-3 h-3" />
        <span>Secured by Paystack 256-bit SSL encryption</span>
      </div>

      {/* Other Payment Options */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500 mb-3 text-center">Other payment options available:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Visa</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Mastercard</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Verve</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Bank Transfer</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">USSD</span>
        </div>
      </div>
    </div>
  );
}
