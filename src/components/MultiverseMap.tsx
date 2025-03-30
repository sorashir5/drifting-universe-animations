
import { useState, useEffect, useMemo } from "react";
import { UniversePoint as UniversePointType, Connection, JumpAnimation } from "@/types/universe";
import UniversePoint from "./UniversePoint";
import ConnectionLine from "./ConnectionLine";
import StabilityIndicator from "./StabilityIndicator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// Initial universe points data
const initialPoints: UniversePointType[] = [
  { id: "1", name: "Evalyn", x: 20, y: 60, size: 12, isVillain: false, driftSpeed: "normal" },
  { id: "2", name: "Kung Fu", x: 60, y: 25, size: 12, isVillain: false, driftSpeed: "slow" },
  { id: "3", name: "Dystopia", x: 75, y: 70, size: 10, isVillain: true, driftSpeed: "fast" },
  { id: "4", name: "Omega", x: 30, y: 40, size: 8, isVillain: false, driftSpeed: "normal" },
  { id: "5", name: "Nexus", x: 45, y: 55, size: 14, isVillain: false, driftSpeed: "slow" },
  { id: "6", name: "Crimson", x: 80, y: 35, size: 10, isVillain: true, driftSpeed: "normal" },
  { id: "7", name: "Cerulean", x: 25, y: 75, size: 9, isVillain: false, driftSpeed: "fast" },
  { id: "8", name: "Emerald", x: 70, y: 50, size: 11, isVillain: false, driftSpeed: "normal" },
  { id: "9", name: "Azure", x: 40, y: 20, size: 10, isVillain: false, driftSpeed: "slow" },
  { id: "10", name: "Onyx", x: 55, y: 80, size: 9, isVillain: true, driftSpeed: "normal" },
];

// Initial connections between points
const initialConnections: Connection[] = [
  { id: "c1", source: "1", target: "4", isJumpLine: false },
  { id: "c2", source: "4", target: "5", isJumpLine: false },
  { id: "c3", source: "5", target: "8", isJumpLine: false },
  { id: "c4", source: "8", target: "2", isJumpLine: false },
  { id: "c5", source: "2", target: "9", isJumpLine: false },
  { id: "c6", source: "5", target: "10", isJumpLine: false },
  { id: "c7", source: "5", target: "3", isJumpLine: false },
  { id: "c8", source: "3", target: "6", isJumpLine: false },
  { id: "c9", source: "5", target: "7", isJumpLine: false },
  { id: "c10", source: "1", target: "7", isJumpLine: false },
];

// Generate random background stars
const generateStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const opacity = Math.random() * 0.5 + 0.3;
    stars.push({ id: `star-${i}`, x, y, size, opacity });
  }
  return stars;
};

const MultiverseMap = () => {
  const [points, setPoints] = useState<UniversePointType[]>(initialPoints);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [jumpTarget, setJumpTarget] = useState<string | null>(null);
  const [stability, setStability] = useState(87);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpAnimation, setJumpAnimation] = useState<JumpAnimation | null>(null);
  
  const stars = useMemo(() => generateStars(150), []);

  // Create a map of points for easier lookup
  const pointsMap = useMemo(() => {
    return points.reduce((acc, point) => {
      acc[point.id] = { x: point.x, y: point.y, size: point.size };
      return acc;
    }, {} as Record<string, { x: number; y: number; size: number }>);
  }, [points]);

  // Handle point selection
  const handlePointClick = (pointId: string) => {
    if (isJumping) return;
    
    if (!selectedPoint) {
      setSelectedPoint(pointId);
    } else if (selectedPoint === pointId) {
      setSelectedPoint(null);
    } else {
      setJumpTarget(pointId);
    }
  };

  // Handle verse jump
  const handleJump = () => {
    if (!selectedPoint || !jumpTarget) return;
    
    setIsJumping(true);
    
    // Create temporary jump connection
    const jumpId = `jump-${Date.now()}`;
    const jumpConnection: Connection = {
      id: jumpId,
      source: selectedPoint,
      target: jumpTarget,
      isJumpLine: true
    };
    
    setConnections(prev => [...prev, jumpConnection]);
    
    // Set jump animation state
    setJumpAnimation({
      source: selectedPoint,
      target: jumpTarget,
      progress: 0,
      isActive: true
    });
    
    // Create toast notification
    toast({
      title: "Verse Jump Initiated",
      description: `Jumping from ${points.find(p => p.id === selectedPoint)?.name} to ${points.find(p => p.id === jumpTarget)?.name}`,
    });
    
    // Reset after animation completes
    setTimeout(() => {
      setConnections(prev => prev.filter(c => c.id !== jumpId));
      setJumpAnimation(null);
      setSelectedPoint(jumpTarget);
      setJumpTarget(null);
      setIsJumping(false);
      
      // Update stability (random small decrease)
      setStability(prev => Math.max(0, Math.min(100, prev - Math.random() * 3 - 1)));
    }, 1500);
  };

  // Cancel jump selection
  const handleCancelJump = () => {
    setJumpTarget(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background grid */}
      <div className="absolute inset-0 universe-grid" />
      
      {/* Background stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}
      
      {/* Connection lines */}
      {connections.map(connection => (
        <ConnectionLine
          key={connection.id}
          connection={connection}
          pointsMap={pointsMap}
        />
      ))}
      
      {/* Universe points */}
      {points.map(point => (
        <UniversePoint
          key={point.id}
          point={point}
          onClick={() => handlePointClick(point.id)}
          isSelected={
            point.id === selectedPoint || point.id === jumpTarget
          }
        />
      ))}
      
      {/* Stability indicator */}
      <StabilityIndicator 
        stability={stability} 
        onStabilityChange={setStability} 
      />
      
      {/* Jump interface */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-sm px-4 py-3 rounded-md border border-universe-point/30 z-30">
          <div className="text-center text-white mb-2">
            {!jumpTarget ? (
              `Selected: ${points.find(p => p.id === selectedPoint)?.name} - Click another point to jump`
            ) : (
              `Jump from ${points.find(p => p.id === selectedPoint)?.name} to ${points.find(p => p.id === jumpTarget)?.name}?`
            )}
          </div>
          
          {jumpTarget && (
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleCancelJump}
                variant="outline"
                className="border-universe-point/50 text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleJump}
                disabled={isJumping}
                className="bg-universe-point hover:bg-universe-point/80 text-white"
              >
                {isJumping ? "Jumping..." : "Jump"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiverseMap;
