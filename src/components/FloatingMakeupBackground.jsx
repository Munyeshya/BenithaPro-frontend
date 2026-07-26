import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brush, Heart } from 'lucide-react';

export default function FloatingMakeupBackground() {
  // A curated, minimal array of floating decorative items
  const elements = [
    { id: 1, icon: Brush, top: '15%', left: '8%', size: 28, delay: 0 },
    { id: 2, icon: Sparkles, top: '25%', right: '12%', size: 24, delay: 1 },
    { id: 3, icon: Heart, top: '65%', left: '10%', size: 20, delay: 2 },
    { id: 4, icon: Brush, top: '75%', right: '15%', size: 32, delay: 1.5 },
    { id: 5, icon: Sparkles, top: '45%', left: '5%', size: 22, delay: 0.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
      {elements.map((el) => {
        const Icon = el.icon;
        return (
          <motion.div
            key={el.id}
            initial={{ y: 0, rotate: 0 }}
            animate={{ 
              y: [-12, 12, -12], 
              rotate: [-5, 5, -5],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: el.delay
            }}
            style={{ top: el.top, left: el.left, right: el.right }}
            className="absolute text-luxury-pink"
          >
            <Icon size={el.size} strokeWidth={1.5} />
          </motion.div>
        );
      })}
    </div>
  );
}