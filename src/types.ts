
// src/types.ts
export interface RiderConfig {
  massKg: number; CdA: number; Crr: number; wheelCircM: number;
  cadenceMin: number; cadenceMax: number;
  defaultTarget: { type: 'power' | 'speed'; value: number; };
  gearing: { frontTeeth: number[]; rearTeeth: number[]; };
}
export interface Waypoint { lat: number; lon: number; elev: number; distFromPrev: number; }
export interface SegmentOverride { targetType: 'power'|'speed'; targetValue: number; cadenceMin: number; cadenceMax: number; }
export interface Segment { id:number; routeId:string; startIdx:number; endIdx:number; avgGradient:number; recommendedGear:string; order:number; override?:SegmentOverride; }
