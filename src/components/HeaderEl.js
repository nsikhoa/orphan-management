import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const HeaderEl = function ({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Feather name="menu" style={styles.container} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: 30,
    marginLeft: 10,
    color: "#fff",
  },
});

export default HeaderEl;
