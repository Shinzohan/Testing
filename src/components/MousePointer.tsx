'use client'

import React, { useEffect, useRef } from 'react';

interface CircleElement extends HTMLDivElement {
  circleX: number;
  circleY: number;
}

const MousePointerAnimation: React.FC = () => {
  const coordsRef = useRef({ x: 0, y: 0 });
  const circlesRef = useRef<CircleElement[]>([]);

  // Updated color palette with light blue tones
  const colors = [
    "#FFFFFF", "#E6F7FF", "#CCF0FF", "#B3E9FF", "#99E2FF",
    "#80DBFF", "#66D4FF", "#4DCFFF", "#33C9FF", "#1AC2FF",
    "#00BBFF", "#00A7E6", "#0093CC", "#007FB3", "#006B99",
    "#005780", "#004366", "#00304D", "#001C33", "#00091A"
];


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      coordsRef.current.x = e.clientX;
      coordsRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    circlesRef.current.forEach((circle) => {
      circle.circleX = 0;
      circle.circleY = 0;
    });

    function animateCircles() {
      let x = coordsRef.current.x;
      let y = coordsRef.current.y;

      circlesRef.current.forEach((circle, index) => {
        circle.style.left = `${x - 12}px`;
        circle.style.top = `${y - 12}px`;
        
        circle.style.scale = ((circlesRef.current.length - index) / circlesRef.current.length).toString();
        
        circle.circleX = x;
        circle.circleY = y;
        const nextCircle = circlesRef.current[index + 1] || circlesRef.current[0];
        x += (nextCircle.circleX - x) * 0.3;
        y += (nextCircle.circleY - y) * 0.3;
      });

      requestAnimationFrame(animateCircles);
    }

    animateCircles();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {colors.map((color, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) {
              circlesRef.current[index] = el as CircleElement;
              (el as CircleElement).circleX = 0;
              (el as CircleElement).circleY = 0;
            }
          }}
          className="circle h-6 w-6 rounded-full fixed top-0 left-0 pointer-events-none z-[99999999]"
          style={{ backgroundColor: color }}
        />
      ))}
    </>
  );
};

export default MousePointerAnimation;