
// src/database.ts
import SQLite from 'react-native-sqlite-storage';
import { Waypoint, Segment } from './types';
const db = SQLite.openDatabase({ name: 'geardb.sqlite', location: 'default' });
export async function initDb() {
  await db.executeSql(`CREATE TABLE IF NOT EXISTS routes (id TEXT PRIMARY KEY, name TEXT, imported_at DATETIME DEFAULT CURRENT_TIMESTAMP, gpx_blob BLOB, config_json TEXT);`);
  await db.executeSql(`CREATE TABLE IF NOT EXISTS waypoints (id INTEGER PRIMARY KEY AUTOINCREMENT, route_id TEXT, seq INTEGER, lat REAL, lon REAL, elev REAL, dist_from_prev REAL);`);
  await db.executeSql(`CREATE TABLE IF NOT EXISTS segments (id INTEGER PRIMARY KEY AUTOINCREMENT, route_id TEXT, start_idx INTEGER, end_idx INTEGER, avg_gradient REAL, recommended_gear TEXT, order_in_route INTEGER);`);
  await db.executeSql(`CREATE TABLE IF NOT EXISTS overrides (id INTEGER PRIMARY KEY AUTOINCREMENT, route_id TEXT, segment_id INTEGER, target_type TEXT, target_value REAL, cadence_min INTEGER, cadence_max INTEGER);`);
}
export function executeSql(sql:string, params:any[] =[]) {
  return new Promise<SQLite.ResultSet>((res,rej)=>{
    db.transaction(tx=> tx.executeSql(sql, params,(_,r)=>res(r),(_,e)=>{ rej(e); return false; }));
  });
}