
import { Connection } from "@/types/universe";
import { cn } from "@/lib/utils";

interface ConnectionLineProps {
  connection: Connection;
  pointsMap: Record<string, { x: number; y: number; size: number }>;
}

const ConnectionLine = ({ connection, pointsMap }: ConnectionLineProps) => {
  const sourcePoint = pointsMap[connection.source];
  const targetPoint = pointsMap[connection.target];
  
  if (!sourcePoint || !targetPoint) return null;

  // Calculate position and rotation
  const deltaX = targetPoint.x - sourcePoint.x;
  const deltaY = targetPoint.y - sourcePoint.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  return (
    <div
      className={cn(
        "connection-line",
        connection.isJumpLine ? "jump-line animate-line-grow" : "dotted-line"
      )}
      style={{
        left: `${sourcePoint.x}%`,
        top: `${sourcePoint.y}%`,
        width: `${distance}%`,
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
};

export default ConnectionLine;
