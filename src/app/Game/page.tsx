'use client';
import React,{ useRef, Suspense, lazy } from 'react';
import { motion, useScroll } from 'framer-motion';
import { projects } from '../data';
import '../globals.css';

const Card = lazy(() => import('@/components/card'));
const DragCards = lazy(() => import('@/components/hover'));

const PostCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden scroll-smooth font-Mystery">
      <motion.div
        ref={containerRef}
        className="h-full overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title Section */}
        <div className="title-div h-screen flex flex-col items-center justify-center text-7xl text-center bg-black shadow-2xl rounded-lg border-black">
          <Suspense fallback={<div>Loading...</div>}>
            <DragCards />
          </Suspense>
          <div className="relative bottom-44">
            <motion.svg
              initial={{ y: 0 }}
              animate={{ opacity: 1, y: "20px" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width={100}
              height={100}
            >
              {/* Arrows */}
              <path
                d="M24 18 L30 6 L24 12 L18 6 L24 18"
                stroke="#000000"
                strokeWidth="1"
                fill="yellow"
              />
              <path
                d="M24 42 L30 30 L24 36 L18 30 L24 42"
                stroke="#000000"
                strokeWidth="1"
                fill="yellow"
              />
            </motion.svg>
          </div>
        </div>
        {/* Parallax Cards Section */}
        <div className="relative">
          {projects.map((project, i) => {
            const targetScale = 1 - ((projects.length - i) * 0.06);
            return (
              <Suspense key={`p_${i}`} fallback={<div>Loading...</div>}>
                <Card
                  i={i}
                  {...project}
                  progress={scrollYProgress}
                  range={[i * 0.25, 1]}
                  targetScale={targetScale}
                />
              </Suspense>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(PostCard);
