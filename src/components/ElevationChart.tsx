

// src/components/ElevationChart.tsx
import React from 'react'; import { View, Dimensions } from 'react-native'; import Svg, { Path, Circle } from 'react-native-svg'; import * as d3 from 'd3-shape';
export default function ElevationChart({ waypoints, segments }){
  const width=Dimensions.get('window').width; const height=150;
  // stub: render full polyline colored by segment
  return (<View><Svg width={width} height={height}><Path d="M0,0"/></Svg></View>);
}