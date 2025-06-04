'use client';
import { useState, useEffect } from 'react';

const images = [
  '/carousel1.jpg',
  '/carousel2.jpg',
  '/carousel3.jpg',
  '/carousel1.jpg',
  '/carousel2.jpg'
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const leftIndex = (index - 1 + images.length) % images.length;
  const centerIndex = index;
  const rightIndex = (index + 1) % images.length;

  return (
    <div className="relative w-full max-w-[95vw] h-[350px] mx-auto flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full">
        {images.map((src, i) => {
          if (![leftIndex, centerIndex, rightIndex].includes(i)) return null;

          let positionClass = '';
          let scale = '';
          let opacity = '';
          let zIndex = '';
          let width = '';

          if (i === centerIndex) {
            positionClass = 'left-1/2';
            scale = 'scale-100';
            opacity = 'opacity-100';
            zIndex = 'z-20';
            width = 'w-[60%]';
          } else if (i === leftIndex) {
            positionClass = 'left-[25%]';
            scale = 'scale-90';
            opacity = 'opacity-70';
            zIndex = 'z-10';
            width = 'w-[40%]';
          } else if (i === rightIndex) {
            positionClass = 'left-[75%]';
            scale = 'scale-90';
            opacity = 'opacity-70';
            zIndex = 'z-10';
            width = 'w-[40%]';
          }

          return (
            <img
              key={src}
              src={src}
              alt={`Imagem ${i}`}
              className={`absolute top-0 ${positionClass} -translate-x-1/2 ${scale} ${opacity} ${zIndex} ${width} h-full object-cover rounded-xl shadow-lg transition-all duration-700 ease-in-out`}
            />
          );
        })}
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-3 rounded-full shadow z-30"
      >
        ❮
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-3 rounded-full shadow z-30"
      >
        ❯
      </button>
    </div>
  );
}
