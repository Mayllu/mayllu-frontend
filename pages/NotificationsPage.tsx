import { useHeaderHeight } from "@react-navigation/elements";
import { View, Text } from "react-native";
import { CreatePageStyle } from "@/utils";

const NotificationsPage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);

  return (
    <View style={pageStyle.container}>
      <Text>Here Notifications Page</Text>
    </View>
  );
};

export default NotificationsPage;
