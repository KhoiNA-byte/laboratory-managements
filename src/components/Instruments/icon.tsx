import React from 'react';
import { ICONS } from '../../constants/instruments/instruments';

interface IconProps {
  name: keyof typeof ICONS;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  className = "w-4 h-4", 
  size 
}) => {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={ICONS[name]} 
      />
    </svg>
  );
};