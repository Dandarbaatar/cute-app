import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";

export const Container = ({ children }: React.PropsWithChildren) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5C8374",
    paddingTop: Constants.statusBarHeight,
  },
});
