
// src/segmentEngine.ts
import { executeSql } from './database';
import { Waypoint, RiderConfig, Segment, SegmentOverride } from './types';
function computeGradient(dp:number,dx:number){return dx? (dp/dx)*100:0;}
function pickOptimalGear(grad:number,config:RiderConfig){return `${config.gearing.frontTeeth[0]}×${config.gearing.rearTeeth[0]}`;}
export async function computeAndStoreSegments(routeId:string,config:RiderConfig):Promise<Segment[]>{
  const rs=await executeSql(`SELECT seq,elev,dist_from_prev FROM waypoints WHERE route_id=? ORDER BY seq;`,[routeId]);
  const wps:Waypoint[]=[]; for(let i=0;i<rs.rows.length;i++){ const r=rs.rows.item(i); wps.push({lat:0,lon:0,elev:r.elev,distFromPrev:r.dist_from_prev}); }
  const intervals=wps.map((pt,idx)=>{ const dp=idx? pt.elev-wps[idx-1].elev:0; const grad=computeGradient(dp,pt.distFromPrev); return {grad,gear:pickOptimalGear(grad,config)}; });
  const segs:Partial<Segment>[]=[]; let cur=intervals[0],start=0;
  for(let i=1;i<intervals.length;i++){ if(intervals[i].gear!==cur.gear){ segs.push({startIdx:start,endIdx:i-1,recommendedGear:cur.gear}); start=i; cur=intervals[i]; } }
  segs.push({startIdx:start,endIdx:intervals.length-1,recommendedGear:cur.gear});
  await executeSql(`DELETE FROM segments WHERE route_id=?;`,[routeId]);
  for(let i=0;i<segs.length;i++){ const s=segs[i]!; let sum=0,c=0; for(let j=s.startIdx!;j<=s.endIdx!;j++){ sum+=intervals[j].grad; c++; } const avg=sum/c;
    await executeSql(`INSERT INTO segments (route_id,start_idx,end_idx,avg_gradient,recommended_gear,order_in_route) VALUES (?,?,?,?,?,?);`,[routeId,s.startIdx,s.endIdx,avg,s.recommendedGear,i]); }
  const out=await executeSql(`SELECT * FROM segments WHERE route_id=? ORDER BY order_in_route;`,[routeId]); return out.rows.raw() as Segment[];
}
export async function fetchSegments(routeId:string):Promise<Segment[]>{
  const rs=await executeSql(
    `SELECT s.*, o.target_type AS overrideType, o.target_value AS overrideValue, o.cadence_min AS overrideCadMin, o.cadence_max AS overrideCadMax
     FROM segments s
     LEFT JOIN overrides o ON s.id=o.segment_id
     WHERE s.route_id=? ORDER BY s.order_in_route;`,[routeId]
  );
  return rs.rows.raw().map(r=>({ id:r.id,routeId:r.route_id,startIdx:r.start_idx,endIdx:r.end_idx,avgGradient:r.avg_gradient,recommendedGear:r.recommended_gear,order:r.order_in_route, override:r.overrideType?{targetType:r.overrideType as any,targetValue:r.overrideValue,cadenceMin:r.overrideCadMin,cadenceMax:r.overrideCadMax}:undefined }));
}
export async function updateSegmentOverride(routeId:string,segmentId:number,override:SegmentOverride):Promise<void>{
  await executeSql(`INSERT OR REPLACE INTO overrides (route_id,segment_id,target_type,target_value,cadence_min,cadence_max) VALUES (?,?,?,?,?,?);`,[routeId,segmentId,override.targetType,override.targetValue,override.cadenceMin,override.cadenceMax]);
}