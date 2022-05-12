import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import UploadImage from "../../components/UploadImage";

const FurnitureDetailScreen = ({ navigation }) => {
  const [furniture, setFurniture] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getFurniture = async function () {
    const id = await AsyncStorage.getItem("furnitureId");
    const token = await AsyncStorage.getItem("accessToken");
    let isMounted = true;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/manager/furniture/${id}`,
        requestOptions
      );
      const result = await response.json();
      // setStaff(result.data);
      setIsLoading(true);
      if (isMounted) setFurniture(result.data);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      throw new Error(e);
    }
  };
  useEffect(getFurniture);
  return (
    <>
      <View style={{ backgroundColor: "#ECF8FF" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("FurnitureUpdate", furniture)}
        >
          <FontAwesome5 style={styles.iconEdit} name="edit" color="black" />
        </TouchableOpacity>
        <Text
          h4
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            margin: 10,
          }}
        >
          Thông tin trang thiết bị
        </Text>
      </View>
      {isLoading ? (
        <View style={styles.content}>
          {furniture.image ? <UploadImage img={furniture.image} /> : <></>}
          <Text style={styles.text}>
            Tên trang thiết bị: {furniture.nameFurniture}
          </Text>
          <Text style={styles.text}>Số lượng: {furniture.quantity}</Text>
          <Text style={styles.text}>
            Trạng thái:{" "}
            {furniture.status === "GOOD" ? "Sử dụng tốt" : "Hư hỏng"}
          </Text>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  iconEdit: {
    alignSelf: "flex-end",
    fontSize: 30,
  },
  content: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default FurnitureDetailScreen;
