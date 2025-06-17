

// src/gpxParser.ts
import { executeSql } from './database';
import haversine from 'haversine-distance';
export async function importGpx(routeId:string, name:string, gpxBlob:Blob, config:any) {
  await executeSql(`INSERT INTO routes (id,name,gpx_blob,config_json) VALUES (?,?,?,?);`,[routeId,name,gpxBlob,JSON.stringify(config)]);
  const text = await gpxBlob.text();
  const xml = new DOMParser().parseFromString(text,'application/xml');
  const pts = Array.from(xml.querySelectorAll('trkpt')).map((pt,i,arr)=>{
    const lat=+pt.getAttribute('lat')!; const lon=+pt.getAttribute('lon')!;
    const elev=+pt.querySelector('ele')!.textContent!;
    const prev=arr[i-1]; const dist= prev? haversine({lat,lon},{lat:+prev.getAttribute('lat')!,lon:+prev.getAttribute('lon')!}):0;
    return { lat, lon, elev, distFromPrev: dist };
  });
  const sql=`INSERT INTO waypoints (route_id,seq,lat,lon,elev,dist_from_prev) VALUES (?,?,?,?,?,?);`;
  for(let i=0;i<pts.length;i++){ const p=pts[i]; await executeSql(sql,[routeId,i,p.lat,p.lon,p.elev,p.distFromPrev]); }
}