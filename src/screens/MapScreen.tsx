
// src/screens/MapScreen.tsx
import React from 'react'; import { View, Text, Button, Dimensions } from 'react-native'; import MapView, { Polyline, Marker } from 'react-native-maps'; import { fetchSegments, computeAndStoreSegments, fetchWaypoints } from '../database'; import { computeAndStoreSegments as computeSegs } from '../segmentEngine'; import ElevationChart from '../components/ElevationChart'; import GearStatus from '../components/GearStatus';
export default function MapScreen({ route }){
  const { routeId, config }=route.params;
  const [segments,setSegments]=React.useState([]);
  const [waypoints,setWps]=React.useState([]);

  React.useEffect(()=>{
    (async()=>{
      await computeSegs(routeId,config);
      setSegments(await fetchSegments(routeId));
      setWps(await fetchWaypoints(routeId));
    })();
  },[]);

  return (<View style={{flex:1}}>
    <MapView style={{flex:1}} initialRegion={{latitude:waypoints[0]?.lat,longitude:waypoints[0]?.lon,latitudeDelta:0.001,longitudeDelta:0.001}}>
      <Polyline coordinates={waypoints.map(w=>({latitude:w.lat,longitude:w.lon}))} strokeWidth={3} strokeColor="#888"/>
    </MapView>
    <ElevationChart waypoints={waypoints} segments={segments}/>
    <GearStatus current={segments[0]} next={segments[1]}/>
  </View>);
}