import { useHeaderHeight } from "@react-navigation/elements";
import { View, Text } from "react-native";
import { CreatePageStyle } from "@/utils";

const HomePage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);

  return (
    <View style={pageStyle.container}>
      <Text>Here Home Page</Text>
    </View>
  );
};

export default HomePage;
