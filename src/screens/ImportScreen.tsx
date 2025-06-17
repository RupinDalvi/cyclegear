
// src/screens/ImportScreen.tsx
import React from 'react'; import { View, Text, Button, TextInput } from 'react-native'; import * as DocumentPicker from 'expo-document-picker'; import { importGpx } from '../gpxParser'; import { v4 as uuidv4 } from 'uuid';
export default function ImportScreen({ navigation }) {
  const [name,setName]=React.useState('');
  const [configJson,setConfigJson]=React.useState('');
  const pick=async()=>{
    const res=await DocumentPicker.getDocumentAsync({type:'application/gpx+xml'});
    if(res.type==='success'){
      const blob=await fetch(res.uri).then(r=>r.blob());
      const routeId=uuidv4();
      const config=JSON.parse(configJson);
      await importGpx(routeId,name,blob,config);
      navigation.navigate('Map',{routeId,config});
    }
  };
  return (<View style={{padding:20}}><Text>Name:</Text><TextInput value={name} onChangeText={setName} style={{borderWidth:1}}/>
    <Text>Config (JSON):</Text><TextInput multiline value={configJson} onChangeText={setConfigJson} style={{borderWidth:1,height:100}}/>
    <Button title="Import GPX" onPress={pick}/></View>);
}