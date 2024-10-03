import { View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '@/constants';

export const CustomTabBarIcon = (name: keyof typeof Ionicons.glyphMap, middleBtn?: boolean) => ({ color }: { color: string }) => {
  return (
    <View style={{
      backgroundColor: middleBtn ? Colors.blue_60 : 'transparent',
      paddingHorizontal: middleBtn ? 16 : 0,
      paddingVertical: middleBtn ? 12 : 0,
      borderRadius: middleBtn ? 8 : 0,
      height: middleBtn ? 50 : 'auto',
    }}>
      <Ionicons name={name} size={24} color={middleBtn ? Colors.white_00 :  color}/>
    </View>
  );
};
