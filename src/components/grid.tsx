import React, { useState, useEffect, useCallback } from 'react';
import anime from 'animejs';

const StaggeredGrid: React.FC = () => {
  const [gridState, setGridState] = useState({
    columns: 0,
    rows: 0,
    total: 0,
    toggled: false
  });

  const getGridSize = useCallback(() => {
    const size = window.innerWidth > 800 ? 100 : 50;
    const columns = Math.floor(window.innerWidth / size);
    const rows = Math.floor(window.innerHeight / size);
    setGridState(prev => ({ ...prev, columns, rows, total: rows * columns }));
  }, []);

  useEffect(() => {
    getGridSize();
    window.addEventListener('resize', getGridSize);
    return () => window.removeEventListener('resize', getGridSize);
  }, [getGridSize]);

  const toggle = () => {
    setGridState(prev => ({ ...prev, toggled: !prev.toggled }));
  };

  const handleOnClick = (index: number) => {
    toggle();
    
    anime({
      targets: ".tile",
      opacity: gridState.toggled ? 1 : 0,
      delay: anime.stagger(50, {
        grid: [gridState.columns, gridState.rows],
        from: index
      })
    });
  };

  return (
    <div className={`h-screen overflow-hidden m-0 ${gridState.toggled ? 'toggled' : ''}`}>
      <style jsx>{`
        @keyframes background-pan {
          from { background-position: 0% center; }
          to { background-position: -200% center; }
        }
        .bg-gradient {
          animation: background-pan 10s linear infinite;
          background: linear-gradient(to right, rgb(98, 0, 234), rgb(236, 64, 122), rgb(98, 0, 234));
          background-size: 200%;
        }
        .toggled { animation: none; }
        .toggled #title { opacity: 0; }
        .toggled #icon { opacity: 1; }
        .toggled #tiles > .tile:hover { opacity: 0.1 !important; }
        .tile:before {
          content: "";
          position: absolute;
          inset: 0.5px;
          background-color: rgb(15, 15, 15);
        }
        .tile:hover:before { background-color: rgb(30, 30, 30); }
      `}</style>
      <div className="bg-gradient h-full">
        <div 
          id="tiles" 
          className="h-[calc(100vh-1px)] w-[calc(100vw-1px)] relative z-10 grid"
          style={{
            gridTemplateColumns: `repeat(${gridState.columns}, 1fr)`,
            gridTemplateRows: `repeat(${gridState.rows}, 1fr)`
          }}
        >
          {[...Array(gridState.total)].map((_, i) => (
            <div
              key={i}
              className="tile cursor-pointer relative"
              style={{ opacity: gridState.toggled ? 0 : 1 }}
              onClick={() => handleOnClick(i)}
            />
          ))}
        </div>
        <h1 id="title" className="centered text-white font-sans text-[6vw] m-0 pointer-events-none transition-opacity duration-1200 w-1/2 z-20">
          WELCOME TO <span className="fancy text-[#EC407A] font-['Dancing_Script'] text-[1.5em] leading-[0.9em]">MY WEBSITE</span>
        </h1>
        <div id="icon" className="centered text-[rgba(255,255,255,0.15)] text-[80vmin] opacity-0 pointer-events-none transition-opacity duration-1200 z-0">
          ♥
        </div>
      </div>
    </div>
  );
};

export default StaggeredGrid;