import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ListItem = (props) => {
  return (
    <View style={styles.container}>
      <Text>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
});

export default ListItem;
