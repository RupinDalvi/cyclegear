
// src/components/GearStatus.tsx
import React from 'react'; import { View, Text } from 'react-native';
export default function GearStatus({ current, next }){
  return (<View style={{padding:10}}>
    <Text>Current Gear: {current?.recommendedGear}</Text>
    <Text>Next Gear: {next?.recommendedGear}</Text>
  </View>);
}