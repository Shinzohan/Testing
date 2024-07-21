"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
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
  }, [gridState]);

  const renderGrid = useCallback(() => (
    Array.from({ length: gridState.total }).map((_, i) => (
      <motion.div 
        key={i} 
        className="tile cursor-pointer relative bg-[rgb(15,15,15)] hover:bg-[rgb(30,30,30)]" 
        onClick={() => handleOnClick(i)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <div className="absolute inset-0.5 bg-[rgb(15,15,15)]"></div>
      </motion.div>
    ))
  ), [gridState.total, handleOnClick]);

  const containerVariants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } } 
  };

  const backgroundImage = isMobile ? '/dunno.png' : '/Onibisteam.png';

  return (
    <motion.div className="relative h-screen overflow-hidden font-Mystery" variants={containerVariants} initial="hidden" animate="visible">
      <div className="absolute flex inset-0 z-0">
        <Image src={backgroundImage} fill alt="Background" priority quality={100} style={{ objectFit: 'cover' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
        <div className="flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-4xl font-black uppercase sm:text-6xl md:text-7xl lg:text-8xl font-medieval mb-4 text-shadow-lg">
              Welcome to Our Game Studio
            </h1>
          </div>
          <div className="space-y-6 text-white text-lg sm:text-xl">
            <p className="bg-black bg-opacity-70 p-4 rounded-lg">
              Dash, possess, and explore your way through different areas as you accompany a child on their adventures as their fledgling guardian spirit.
            </p>
          </div>
        </div>
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