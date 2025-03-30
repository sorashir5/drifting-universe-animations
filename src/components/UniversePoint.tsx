
import { useState, useEffect } from "react";
import { UniversePoint as UniversePointType } from "@/types/universe";
import { cn } from "@/lib/utils";

interface UniversePointProps {
  point: UniversePointType;
  onClick: () => void;
  isSelected: boolean;
}

const UniversePoint = ({ point, onClick, isSelected }: UniversePointProps) => {
  const [initialDelay, setInitialDelay] = useState<number>(Math.random() * 5);
  
  useEffect(() => {
    // Randomize initial animation delay
    setInitialDelay(Math.random() * 5);
  }, [point.id]);

  const driftClass = 
    point.driftSpeed === 'slow' ? 'animate-drift-slow' : 
    point.driftSpeed === 'fast' ? 'animate-drift-fast' : 
    'animate-drift';

  return (
    <>
      <div
        className={cn(
          "universe-point cursor-pointer transition-all duration-300",
          driftClass,
          point.isVillain ? "bg-universe-villain villain" : "bg-universe-point",
          isSelected && "ring-2 ring-white animate-pulse-glow"
        )}
        style={{
          left: `${point.x}%`,
          top: `${point.y}%`,
          width: `${point.size}px`,
          height: `${point.size}px`,
          animationDelay: `-${initialDelay}s`,
        }}
        onClick={onClick}
      />
      <div
        className={cn(
          "universe-label transition-all", 
          driftClass
        )}
        style={{
          left: `calc(${point.x}% + ${point.size / 2 + 10}px)`,
          top: `calc(${point.y}% - ${point.size / 2}px)`,
          animationDelay: `-${initialDelay}s`,
        }}
      >
        {point.name}
      </div>
    </>
  );
};

export default UniversePoint;
