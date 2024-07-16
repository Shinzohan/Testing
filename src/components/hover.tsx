import React, { MutableRefObject, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import LaunchingText from "./Animatedtext";

export const DragCards = React.memo(() => {
  return (
    <section className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-black">
      <div className="relative z-0">
        <LaunchingText /> 
      </div>
      <Cards />
    </section>
  );
});

const Cards = React.memo(() => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const cardData = useMemo(() => [
    {
      src: "/Boy.png",
      alt: "Example image",
      rotate: "6deg",
      top: "20%",
      left: "25%",
      className: "w-36 md:w-56"
    },
    {
      src: "/forest.png",
      alt: "Example image",
      rotate:"12deg",
      top:"45%",
      left:"60%",
      className:"w-60 md:w-80"
    },
    {
      src: "/lamp.png",
      alt: "Example image",
      rotate: "-6deg",
      top: "20%",
      left: "40%",
      className: "w-52 md:w-80"
    },
    {
      src: "/witch.png",
      alt: "Example image",
      rotate: "8deg",
      top: "50%",
      left: "40%",
      className: "w-42 md:w-72"
    },
    
    
    
    
    
  ], []);

  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      {cardData.map((card, index) => (
        <Card
          key={index}
          containerRef={containerRef}
          {...card}
        />
      ))}
    </div>
  );
});

interface Props {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  src: string;
  alt: string;
  top: string;
  left: string;
  rotate: string;
  className?: string;
}

const Card = React.memo(({
  containerRef,
  src,
  alt,
  top,
  left,
  rotate,
  className,
}: Props) => {
  const [zIndex, setZIndex] = useState(0);

  const updateZIndex = useCallback(() => {
    setZIndex(prev => prev + 1);
  }, []);

  return (
    <motion.img
      onMouseDown={updateZIndex}
      style={{
        top,
        left,
        rotate,
        zIndex,
      }}
      className={twMerge(
        "drag-elements absolute w-48 bg-neutral-200 p-1 pb-4",
        className
      )}
      src={src}
      alt={alt}
      drag
      dragConstraints={containerRef}
      dragElastic={0.65}
      loading="lazy"
    />
  );
});

export default DragCards;