import { motion } from 'framer-motion';

const PotteryVase3D = () => {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ 
          rotateY: [0, 360],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Main vase with gradient */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Glow effect */}
          <div 
            className="absolute inset-0 blur-2xl opacity-40"
            style={{
              background: 'radial-gradient(circle, hsl(25 50% 60%) 0%, transparent 70%)',
              transform: 'scale(1.5)',
            }}
          />
          
          {/* Vase SVG with premium styling */}
          <svg
            viewBox="0 0 120 180"
            className="w-48 h-72 relative z-10"
            style={{ 
              filter: 'drop-shadow(0 20px 40px hsl(25 40% 30% / 0.4))',
            }}
          >
            <defs>
              {/* Main gradient for vase body */}
              <linearGradient id="vaseBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(30 45% 70%)" />
                <stop offset="30%" stopColor="hsl(25 50% 60%)" />
                <stop offset="60%" stopColor="hsl(20 55% 50%)" />
                <stop offset="100%" stopColor="hsl(15 60% 40%)" />
              </linearGradient>
              
              {/* Highlight gradient for 3D effect */}
              <linearGradient id="vaseHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(35 40% 80%)" stopOpacity="0.6" />
                <stop offset="30%" stopColor="transparent" stopOpacity="0" />
                <stop offset="100%" stopColor="hsl(15 50% 35%)" stopOpacity="0.4" />
              </linearGradient>
              
              {/* Shadow gradient */}
              <radialGradient id="vaseShadow" cx="50%" cy="100%" r="50%">
                <stop offset="0%" stopColor="hsl(20 30% 20%)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              
              {/* Rim gradient */}
              <linearGradient id="rimGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(25 40% 55%)" />
                <stop offset="100%" stopColor="hsl(20 50% 45%)" />
              </linearGradient>
            </defs>
            
            {/* Shadow ellipse */}
            <ellipse cx="60" cy="175" rx="35" ry="8" fill="url(#vaseShadow)" />
            
            {/* Main vase body */}
            <path 
              d="M60 10
                 C55 10 50 15 48 22
                 C46 29 45 38 45 45
                 C45 52 44 58 42 62
                 C40 66 37 70 35 75
                 C33 80 32 86 32 92
                 C32 105 38 118 48 128
                 C52 132 55 138 57 145
                 C58 150 59 156 60 162
                 C61 156 62 150 63 145
                 C65 138 68 132 72 128
                 C82 118 88 105 88 92
                 C88 86 87 80 85 75
                 C83 70 80 66 78 62
                 C76 58 75 52 75 45
                 C75 38 74 29 72 22
                 C70 15 65 10 60 10Z" 
              fill="url(#vaseBodyGradient)"
            />
            
            {/* Highlight overlay for 3D depth */}
            <path 
              d="M60 10
                 C55 10 50 15 48 22
                 C46 29 45 38 45 45
                 C45 52 44 58 42 62
                 C40 66 37 70 35 75
                 C33 80 32 86 32 92
                 C32 105 38 118 48 128
                 C52 132 55 138 57 145
                 C58 150 59 156 60 162
                 C61 156 62 150 63 145
                 C65 138 68 132 72 128
                 C82 118 88 105 88 92
                 C88 86 87 80 85 75
                 C83 70 80 66 78 62
                 C76 58 75 52 75 45
                 C75 38 74 29 72 22
                 C70 15 65 10 60 10Z" 
              fill="url(#vaseHighlight)"
            />
            
            {/* Rim at top */}
            <ellipse cx="60" cy="12" rx="12" ry="4" fill="url(#rimGradient)" />
            
            {/* Inner rim shadow */}
            <ellipse cx="60" cy="12" rx="8" ry="2.5" fill="hsl(15 40% 30%)" />
            
            {/* Decorative ring pattern */}
            <ellipse cx="60" cy="50" rx="30" ry="3" fill="none" stroke="hsl(35 40% 75%)" strokeWidth="0.5" opacity="0.5" />
            <ellipse cx="60" cy="90" rx="28" ry="3" fill="none" stroke="hsl(35 40% 75%)" strokeWidth="0.5" opacity="0.4" />
            <ellipse cx="60" cy="120" rx="22" ry="2.5" fill="none" stroke="hsl(35 40% 75%)" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PotteryVase3D;
