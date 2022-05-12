import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UploadImage from "./UploadImage";

const center = [
  { name: "Trẻ em" },
  { name: "Nhân viên" },
  { name: "Trang thiết bị" },
];
const activities = [
  "Từ thiện",
  "Dã ngoại",
  "Nhận nuôi",
  "Giới thiệu trẻ",
  "Phản hồi",
  "Thống kê",
  "Báo cáo",
];

const checkScreen = function (nameScreen) {
  switch (nameScreen) {
    case "Tài khoản":
      return "account";
    case "Trẻ em":
      return "children";
    case "Nhân viên":
      return "staffs";
    case "Trang thiết bị":
      return "furniture";
  }
};

const SideMenu = function ({ navigation }) {
  const [info, setInfo] = useState({});

  const getInfo = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "https://orphanmanagement.herokuapp.com/api/v1/auth/account",
        requestOptions
      );
      const result = await response.json();
      setInfo(result.data);
    } catch (e) {
      throw new Error(e);
    }
  };

  useEffect(getInfo, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F1E80" }}>
      <View
        style={{ height: 150, alignItems: "center", justifyContent: "center" }}
      >
        <UploadImage img={info.image} />
      </View>
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => navigation.navigate(checkScreen("Tài khoản"))}
        >
          <Text style={styles.text}>Tài khoản</Text>
        </TouchableOpacity>
        <Text h4 style={styles.textHead}>
          Trung tâm
        </Text>
        <FlatList
          data={center}
          keyExtractor={(center) => center.name}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.touch}
                onPress={() => navigation.navigate(checkScreen(item.name))}
              >
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <Text h4 style={styles.textHead}>
          Hoạt động
        </Text>
        <FlatList
          data={activities}
          keyExtractor={(activity) => activity}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={styles.touch}>
                <Text style={styles.text}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <TouchableOpacity
          style={styles.touchLogout}
          onPress={() => navigation.navigate("auth")}
        >
          <MaterialIcons
            name="logout"
            size={25}
            color="#fff"
            style={{ marginTop: 1, marginRight: 5 }}
          />
          <Text h4 style={styles.textHead}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    alignItems: "center",
    flex: 1,
  },
  textHead: {
    color: "#fff",
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
  touch: {
    padding: 10,
  },
  touchLogout: {
    flexDirection: "row",
  },
});

export default SideMenu;
