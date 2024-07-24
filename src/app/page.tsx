"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation, Variants } from 'framer-motion';
import anime from 'animejs';
import './globals.css';

const Home: React.FC = () => {
  const [gridState, setGridState] = useState<{
    columns: number;
    rows: number;
    total: number;
    toggled: boolean;
  }>({ columns: 0, rows: 0, total: 0, toggled: false });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const controls = useAnimation();
  const gridRef = useRef<HTMLDivElement>(null);

  const updateGridSize = useCallback(() => {
    const isMobileView = window.innerWidth < 768;
    const size = 80; 
    const columns = Math.floor(window.innerWidth / size);
    const rows = Math.floor(window.innerHeight / size);
    setGridState(prev => ({ ...prev, columns, rows, total: rows * columns }));
    setIsMobile(isMobileView);
  }, []);

  useEffect(() => {
    updateGridSize();

    const debouncedResize = debounce(() => {
      updateGridSize();
    }, 250);

    window.addEventListener('resize', debouncedResize);
    controls.start('visible');

    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [updateGridSize, controls]);

  const handleOnClick = useCallback((index: number) => {
    setGridState(prev => ({ ...prev, toggled: !prev.toggled }));
    anime({
      targets: ".tile",
      opacity: gridState.toggled ? 1 : 0,
      delay: anime.stagger(50, { grid: [gridState.columns, gridState.rows], from: index })
    });
    
    // Add a delay before showing the text
    setTimeout(() => {
      setShowText(true);
    }, 200);
  }, [gridState]);

  const renderGrid = useCallback(() => (
    Array.from({ length: gridState.total }).map((_, i) => (
      <motion.div 
        key={i} 
        className="tile cursor-pointer relative bg-black hover:bg-transparent" 
        onClick={() => handleOnClick(i)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <div className="absolute inset-0.5 bg-transparent"></div>
      </motion.div>
    ))
  ), [gridState.total, handleOnClick]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } }
  };

  const bgVariants: Variants = {
    hidden: { clipPath: 'circle(0% at 50% 50%)' },
    visible: {
      clipPath: 'circle(75% at 50% 50%)',
      transition: { duration: 3.5 }
    }
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div className="relative h-screen overflow-hidden font-Mystery" variants={containerVariants} initial="hidden" animate="visible">
      <div className="absolute w-full h-full overflow-hidden z-0">
        <motion.video
          src="/Background.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-80"
          preload="auto"
          poster="/Onibisteam.png"
          variants={bgVariants}
          initial="hidden"
          animate={isMobile ? "visible" : controls}
        />
        <div className="absolute w-full h-full bg-gradient-to-t from-black via-transparent to-black" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
        <motion.div 
          className="flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto"
          variants={textVariants}
          initial="hidden"
          animate={showText ? "visible" : "hidden"}
        >
          <div className="text-center text-white">
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl font-black uppercase sm:text-6xl md:text-7xl lg:text-8xl font-medieval mb-4 text-shadow-lg"
            >
              Welcome to Our Game Studio
            </motion.h1>
          </div>
          <motion.div variants={itemVariants} className="space-y-6 text-white text-lg sm:text-xl">
            
          </motion.div>
         
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-4 mb-4 flex pb-[100px] xl:pb-[100px]">
        <Image src='/Onibichan.svg' alt='onibilogo' width={80} height={80} priority />
      </div>
      <div 
        ref={gridRef} 
        id="tiles" 
        className="absolute inset-0 z-20 grid gap-[1px]" 
        style={{ 
          gridTemplateColumns: `repeat(${gridState.columns}, minmax(0, 1fr))`, 
          gridTemplateRows: `repeat(${gridState.rows}, minmax(0, 1fr))` 
        }}
      >
        {renderGrid()}
      </div>
      <style jsx global>{`
        .tile { transition: opacity 0.5s ease; will-change: opacity; }
        body { overflow: hidden; }
        #tiles { height: 100vh; width: 100vw; }
        .text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .text-shadow-lg { text-shadow: 3px 3px 6px rgba(0,0,0,0.8); }
      `}</style>
    </motion.div>
  );
};

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default React.memo(Home);