
// src/components/SegmentModal.tsx
import React from 'react'; import { Modal, View, Text, TextInput, Button } from 'react-native'; import { updateSegmentOverride } from '../segmentEngine';
export default function SegmentModal({ visible, segment, onClose }){
  const [target, setTarget]=React.useState('power');
  const [value, setValue]=React.useState('');
  if(!segment) return null;
  return (<Modal visible={visible} transparent>
    <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center'}}>
      <View style={{backgroundColor:'#fff',padding:20}}>
        <Text>Override Segment</Text>
        <Text>Type: power or speed</Text>
        <TextInput value={target} onChangeText={setTarget}/>
        <Text>Value:</Text>
        <TextInput value={value} onChangeText={setValue} keyboardType="numeric"/>
        <Button title="Save" onPress={async()=>{ await updateSegmentOverride(segment.routeId,segment.id,{ targetType: target as any, targetValue: +value, cadenceMin: segment.override?.cadenceMin||segment.override?.cadenceMin||90, cadenceMax: segment.override?.cadenceMax||segment.override?.cadenceMax||110 }); onClose(); }} />
        <Button title="Cancel" onPress={onClose}/>
      </View>
    </View>
  </Modal>);
}