import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Button, TouchableHighlight } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StatusBar style="auto" />
      <Text className="text-red-500">Mayllu</Text>
      <Image source={{ uri: "https://avatars.githubusercontent.com/u/182351256?s=200&v=4" }} style={{ width: 200, height: 200 }} />
      <Button title="Presiona para mostrar modal" onPress={() => alert("Probando mayllu jaja")} />
    </View>
  );
};

registerRootComponent(App);
