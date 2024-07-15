"use client";

import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { FiMousePointer } from 'react-icons/fi';
import anime from 'animejs';
import './globals.css';

const Home: React.FC = () => {
  const [gridState, setGridState] = useState({ columns: 0, rows: 0, total: 0, toggled: false });
  const [showClickMe, setShowClickMe] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();

  const updateGridSize = useCallback(() => {
    const size = window.innerWidth < 768 ? 50 : 100;
    const columns = Math.floor(window.innerWidth / size);
    const rows = Math.floor(window.innerHeight / size);
    setGridState({ columns, rows, total: rows * columns, toggled: false });
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    updateGridSize();
    setGridKey(k => k + 1);

    const debouncedResize = debounce(() => {
      updateGridSize();
      setGridKey(k => k + 1);
    }, 250);

    window.addEventListener('resize', debouncedResize);
    controls.start('visible');
    const timer = setTimeout(() => setShowClickMe(true), 1000);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timer);
    };
  }, [updateGridSize, controls]);

  const handleOnClick = useCallback((index: number) => {
    setGridState(prev => ({ ...prev, toggled: !prev.toggled }));
    setShowClickMe(false);
    anime({
      targets: ".tile",
      opacity: gridState.toggled ? 1 : 0,
      delay: anime.stagger(50, { grid: [gridState.columns, gridState.rows], from: index })
    });
  }, [gridState]);

  const renderGrid = useCallback(() => (
    Array.from({ length: gridState.total }).map((_, i) => (
      <div key={i} className="tile cursor-pointer relative bg-[rgb(15,15,15)] hover:bg-[rgb(30,30,30)]" onClick={() => handleOnClick(i)}>
        <div className="absolute inset-0.5 bg-[rgb(15,15,15)]"></div>
      </div>
    ))
  ), [gridState.total, handleOnClick]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } } };

  const backgroundImage = isMobile ? '/dunno.png' : '/Onibisteam.png';

  return (
    <motion.div className="relative h-screen overflow-hidden font-Mystery" variants={containerVariants} initial="hidden" animate="visible">
      <div className="absolute flex inset-0 z-0">
        <Image src={backgroundImage} fill alt="Background" priority quality={100} style={{ objectFit: 'cover' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="text-center text-white">
            <h1 className="text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-8xl font-medieval">Welcome to Our Game Studio</h1>
            <p className="mt-4 text-xl md:text-2xl font-medieval">Creating immersive gaming experiences</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 xl:left-10 mb-4 flex pb-[100px] gap-5 sm:left-1 ml-4">
        <Image src='/Onibichan.svg' alt='onibilogo' width={100} height={100} priority />
      </div>
      <div key={gridKey} id="tiles" className="absolute inset-0 z-20 grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${gridState.columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${gridState.rows}, minmax(0, 1fr))` }}>
        {renderGrid()}
      </div>
      <AnimatePresence>
        {showClickMe && (
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <motion.div className="absolute w-32 h-32 bg-transparent border-4 border-white rounded-full" style={{opacity: 0}} animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div className="text-white text-3xl font-bold bg-transparent bg-opacity-50 px-6 py-3 rounded-full">
                <FiMousePointer />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .tile { transition: opacity 0.5s ease; will-change: opacity; }
        body { overflow: hidden; }
        #tiles { height: calc(100vh - 1px); width: calc(100vw - 1px); }
      `}</style>
    </motion.div>
  );
};

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default React.memo(Home);
