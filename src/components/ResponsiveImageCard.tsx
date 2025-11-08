import React from 'react';
import { OptimizedImage } from '../utils/imageOptimization';

interface ResponsiveImageCardProps {
  imageSrc: string;
  imageAlt: string;
  textContent?: string;
  textPosition?: 'top' | 'bottom' | 'center' | 'overlay';
  textColor?: string;
  backgroundColor?: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

const ResponsiveImageCard: React.FC<ResponsiveImageCardProps> = ({
  imageSrc,
  imageAlt,
  textContent,
  textPosition = 'bottom',
  textColor = 'text-white',
  backgroundColor = 'bg-black/40',
  className = '',
  aspectRatio = '16/9',
  priority = false,
}) => {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ aspectRatio }}>
      <OptimizedImage
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
        lazy={!priority}
      />
      
      {textContent && (
        <div 
          className={`
            absolute ${getPositionClasses(textPosition)} 
            p-3 ${textPosition === 'overlay' ? 'w-full h-full' : 'w-full'} 
            ${textPosition === 'overlay' ? backgroundColor : ''}
          `}
        >
          <p className={`text-sm sm:text-base font-medium ${textColor} ${textPosition === 'overlay' ? 'flex items-center justify-center h-full' : ''}`}>
            {textContent}
          </p>
        </div>
      )}
    </div>
  );
};

function getPositionClasses(position: string): string {
  switch (position) {
    case 'top': return 'inset-x-0 top-0';
    case 'center': return 'inset-0 flex items-center justify-center';
    case 'bottom': return 'inset-x-0 bottom-0';
    case 'overlay': return 'inset-0';
    default: return 'inset-x-0 bottom-0';
  }
}

export default ResponsiveImageCard;
