import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import UploadImage from "../../components/UploadImage";

const ChildrenDetailScreen = function ({ navigation }) {
  const [children, setChildren] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getChildren = async function () {
    const id = await AsyncStorage.getItem("childId");
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/children/${id}`,
        requestOptions
      );
      const result = await response.json();
      // setStaff(result.data);
      setIsLoading(true);
      if (isMounted) setChildren(result.data);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      throw new Error(e);
    }
  };
  useEffect(getChildren);

  return (
    <>
      <View style={{ backgroundColor: "#ECF8FF" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChildrenUpdate", children)}
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
          Thông tin trẻ em
        </Text>
      </View>
      {isLoading ? (
        <View style={styles.content}>
          {children.image ? <UploadImage img={children.image} /> : <></>}
          <Text style={styles.text}>Họ và tên: {children.fullName}</Text>
          <Text style={styles.text}>Ngày sinh: {children.dateOfBirth}</Text>
          <Text style={styles.text}>
            Giới tính: {children.gender ? "Nam" : "Nữ"}
          </Text>
          <Text style={styles.text}>
            Ngày vào trung tâm: {children.introductoryDate}
          </Text>
          <Text style={styles.text}>
            Trạng thái:{" "}
            {children.status === "WAIT_TO_RECEIVE"
              ? "Đang ở trung tâm"
              : "Đã được nhận nuôi"}
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

export default ChildrenDetailScreen;
