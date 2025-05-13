import React from 'react';

interface CityButtonProps {
  city: string;
  isActive: boolean;
  onClick: (city: string) => void;
}

const CityButton = ({ city, isActive, onClick }: CityButtonProps) => {
  return (
    <button
      onClick={() => onClick(city)}
      className={`
        px-4 py-2 rounded-full transition-all duration-300
        ${isActive 
          ? 'bg-[#0A3D62] text-white' 
          : 'bg-white text-[#0A3D62] border border-[#0A3D62] hover:bg-[#E6F0F9]'
        }
      `}
    >
      {city}
    </button>
  );
};

export default CityButton;