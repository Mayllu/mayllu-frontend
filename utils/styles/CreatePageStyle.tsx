import { StyleSheet } from "react-native";

export const CreatePageStyle = (headerHeight: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: headerHeight + 20,
    },
  });
