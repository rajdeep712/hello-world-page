import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

interface PaymentProcessingOverlayProps {
  status: 'processing' | 'success' | 'verifying';
}

export default function PaymentProcessingOverlay({ status }: PaymentProcessingOverlayProps) {
  const messages = {
    processing: 'Processing your payment...',
    verifying: 'Verifying payment...',
    success: 'Payment successful!',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center space-y-6"
      >
        {status === 'success' ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
          </motion.div>
        ) : (
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-20 h-20 text-primary mx-auto" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
            </motion.div>
          </div>
        )}
        
        <motion.p
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-display text-foreground"
        >
          {messages[status]}
        </motion.p>
        
        {status !== 'success' && (
          <p className="text-sm text-muted-foreground">
            Please do not close this window
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
