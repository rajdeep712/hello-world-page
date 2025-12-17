import { motion } from 'framer-motion';
import potteryVaseImage from '@/assets/pottery-vase-3d.png';

const PotteryVase3D = () => {
  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ 
          rotateY: [0, 360],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Floating animation wrapper */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Soft glow effect behind the vase */}
          <div 
            className="absolute inset-0 blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(circle, hsl(35 45% 70%) 0%, hsl(25 40% 50%) 40%, transparent 70%)',
              transform: 'scale(1.8)',
            }}
          />
          
          {/* Shadow under the vase */}
          <div 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 blur-xl opacity-40"
            style={{
              background: 'radial-gradient(ellipse, hsl(25 30% 25%) 0%, transparent 70%)',
              transform: 'rotateX(90deg)',
            }}
          />
          
          {/* Main vase image with 3D effect */}
          <motion.img
            src={potteryVaseImage}
            alt="Decorative pottery vase"
            className="relative z-10 w-64 h-auto object-contain drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 25px 50px hsl(25 40% 20% / 0.5))',
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Subtle reflection/shine overlay */}
          <div 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, hsl(45 30% 90% / 0.1) 50%, transparent 70%)',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PotteryVase3D;
