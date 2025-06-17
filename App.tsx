
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initDb } from './src/database';
import ImportScreen from './src/screens/ImportScreen';
import MapScreen from './src/screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  React.useEffect(() => { initDb(); }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Import">
        <Stack.Screen name="Import" component={ImportScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}