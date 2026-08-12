import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brush, Heart } from 'lucide-react';

export default function FloatingMakeupBackground() {
  const elements = [
    { id: 1, icon: Brush, top: '15%', left: '8%', size: 28, delay: 0 },
    { id: 2, icon: Sparkles, top: '25%', right: '12%', size: 24, delay: 1 },
    { id: 3, icon: Heart, top: '65%', left: '10%', size: 20, delay: 2 },
    { id: 4, icon: Brush, top: '75%', right: '15%', size: 32, delay: 1.5 },
    { id: 5, icon: Sparkles, top: '45%', left: '5%', size: 22, delay: 0.5 },
    { id: 6, icon: Heart, top: '35%', right: '25%', size: 36, delay: 2.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 opacity-30">
      {elements.map((el) => {
        const Icon = el.icon;
        return (
          <motion.div
            key={el.id}
            initial={{ y: 0, rotate: 0 }}
            animate={{ 
              y: [-15, 15, -15], 
              rotate: [-8, 8, -8],
              scale: [1, 1.08, 1]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: el.delay
            }}
            style={{ top: el.top, left: el.left, right: el.right }}
            className="absolute text-luxury-pink drop-shadow-[0_0_8px_rgba(212,175,55,0.35)]"
          >
            <Icon size={el.size} strokeWidth={1.5} />
          </motion.div>
        );
      })}
    </div>
  );
}
