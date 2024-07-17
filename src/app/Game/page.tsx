'use client';
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { projects } from '../data';
import '../globals.css';
import dynamic from 'next/dynamic';

type Project = typeof projects[number];

const Card = dynamic<Project & { i: number; progress: any; range: number[]; targetScale: number }>(
  () => import('@/components/card').then(mod => mod.default),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const DragCards = dynamic(() => import('@/components/hover').then(mod => mod.default), 
  { ssr: false, loading: () => <div>Loading...</div> }
);

const PostCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [renderedProjects, setRenderedProjects] = useState<JSX.Element[]>([]);

  const renderProject = useCallback((project: Project, i: number) => {
    const targetScale = 1 - ((projects.length - i) * 0.06);
    return (
      <Card
        key={`p_${i}`}
        i={i}
        {...project}
        progress={scrollYProgress}
        range={[i * 0.25, 1]}
        targetScale={targetScale}
      />
    );
  }, [scrollYProgress]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setRenderedProjects(prev => 
              prev.some(p => p.key === `p_${index}`) ? prev : [...prev, renderProject(projects[index], index)]
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px' }
    );

    projects.forEach((_, index) => {
      const el = document.createElement('div');
      el.setAttribute('data-index', index.toString());
      containerRef.current?.appendChild(el);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [renderProject, projects]);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden scroll-smooth font-Mystery">
      <motion.div
        ref={containerRef}
        className="h-full overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="title-div h-screen flex flex-col items-center justify-center text-7xl text-center bg-black shadow-2xl rounded-lg border-black">
          <DragCards />
          <motion.svg
            initial={{ y: 0 }}
            animate={{ opacity: 1, y: "20px" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={100}
            height={100}
            className="relative bottom-44 mb-32"
          >
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
        <div className="relative">
          {renderedProjects}
        </div>
      </motion.div>
    </div>
  );
};

export default PostCard;