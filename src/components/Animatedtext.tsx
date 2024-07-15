import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LaunchingText: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const textVariants = [
    "Check out Onibi's gameplay",
    "Scroll down"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textVariants.length);
    }, 4000); 

    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: { y: 20, opacity: 0 },
    center: { y: -8, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <div className=' overflow-hidden h-full w-full p-10  text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl'>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTextIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
          {textVariants[currentTextIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LaunchingText;