'use client';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import '@/app/globals.css'

type CardProps = {
  i: number;
  title: string;
  description: string;
  src: string;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
};

const Card = ({ i, title, description, src, progress, range, targetScale }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useTransform(progress, range, [0, -100]);
  const scale = useTransform(progress, range, [1, targetScale]);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <div ref={containerRef} className="sticky top-0 flex items-center justify-center h-screen">
      <motion.div
        style={{
          y,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
          clipPath: 'polygon(0% 0%, 10% 10%, 90% 10%, 100% 0%, 100% 100%, 10% 90%, 0% 100%)', 
        }}
        className="relative flex flex-col p-5 transform-origin-top shadow-2xl bg-zinc-800 overflow-hidden xl:w-[900px] xl:h-[500px] sm:w-[600px] sm:h-[500px]"
      >
        <h2 className="text-2xl font-bold text-center mb-4 relative z-10 text-white underline">{title}</h2>
        <div className="flex flex-col items-center h-full relative z-10">
          <div className="flex-grow flex items-center justify-center w-[90%]">
            <p className="text-base leading-relaxed text-white text-center">
              <span className="text-3xl font-semibold">{description[0]}</span>
              {description.slice(1)}
            </p>
          </div>
          <div ref={inViewRef} className="xl:w-[60%] xl:h-[300px] sm:w-[90%] sm:h-[200px] rounded-2xl overflow-hidden shadow-lg mt-4">
            {inView && (
              <motion.video
                className={`object-cover w-full h-full transition-opacity duration-300 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                src={`/video/${src}`}
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={handleVideoLoad}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
