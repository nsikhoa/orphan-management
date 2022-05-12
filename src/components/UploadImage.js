import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

const UploadImage = function ({ img }) {
  return (
    <View style={styles.container}>
      {img ? <Image style={styles.image} source={{ uri: `${img}` }} /> : <></>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
  },
});

export default UploadImage;
