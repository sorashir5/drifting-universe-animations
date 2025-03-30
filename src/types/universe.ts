
export interface UniversePoint {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  isVillain: boolean;
  driftSpeed?: 'normal' | 'slow' | 'fast';
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  isJumpLine?: boolean;
}

export interface JumpAnimation {
  source: string;
  target: string;
  progress: number;
  isActive: boolean;
}
