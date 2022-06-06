import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UploadImage from "./UploadImage";

const centerAdmin = [
  { name: "Trẻ em" },
  { name: "Nhân viên" },
  { name: "Trang thiết bị" },
];
const activitiesAdmin = [
  "Từ thiện",
  "Dã ngoại",
  "Nhận nuôi trẻ",
  "Giới thiệu trẻ",
  "Thống kê",
];

const centerChildren = [{ name: "Trẻ em" }];
const activitiesChildren = ["Nhận nuôi trẻ", "Giới thiệu trẻ"];

const centerHR = [{ name: "Nhân viên" }];
const activitiesHR = [];

const centerLogis = [{ name: "Trang thiết bị" }];
const activitiesLogis = ["Từ thiện", "Dã ngoại"];

const checkScreen = function (nameScreen) {
  switch (nameScreen) {
    case "Profile":
      return "profile";
    case "Tài khoản":
      return "account";
    case "Trẻ em":
      return "children";
    case "Nhân viên":
      return "staffs";
    case "Trang thiết bị":
      return "furniture";
    case "Giới thiệu trẻ":
      return "introducer";
    case "Nhận nuôi trẻ":
      return "nurturer";
    case "Dã ngoại":
      return "picnic";
    case "Thống kê":
      return "stat";
  }
};

const SideMenu = function ({ navigation }) {
  const [info, setInfo] = useState({});
  const [role, setRole] = useState("");
  const [center, setCenter] = useState([]);
  const [activities, setActivities] = useState([]);

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
        "https://orphanmanagement.herokuapp.com/api/v1/profile/account",
        requestOptions
      );
      const result = await response.json();
      setInfo(result.data);
      setRole(result.data.roles[0].roleName);
      switch (role) {
        case "ROLE_ADMIN":
          setCenter(centerAdmin);
          setActivities(activitiesAdmin);
          break;
        case "ROLE_MANAGER_CHILDREN":
          setCenter(centerChildren);
          setActivities(activitiesChildren);
          break;
        case "ROLE_MANAGER_HR":
          setCenter(centerHR);
          setActivities(activitiesHR);
          break;
        case "ROLE_MANAGER_LOGISTIC":
          setCenter(centerLogis);
          setActivities(activitiesLogis);
          break;
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  useEffect(getInfo);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F1E80" }}>
      <View
        style={{ height: 150, alignItems: "center", justifyContent: "center" }}
      >
        <UploadImage img={info.image} />
      </View>
      <View style={styles.navContainer}>
        {role === "ROLE_ADMIN" ? (
          <TouchableOpacity
            style={styles.touch}
            onPress={() => navigation.navigate(checkScreen("Tài khoản"))}
          >
            <Text style={styles.text}>Tài khoản</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
        <TouchableOpacity
          style={styles.touch}
          onPress={() => navigation.navigate(checkScreen("Profile"))}
        >
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
        <Text h4 style={styles.textHead}>
          Trung tâm
        </Text>
        {center ? (
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
        ) : (
          <ActivityIndicator />
        )}

        <Text h4 style={styles.textHead}>
          Hoạt động
        </Text>
        {activities ? (
          <FlatList
            data={activities}
            keyExtractor={(activity) => activity}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.touch}
                  onPress={() => navigation.navigate(checkScreen(item))}
                >
                  <Text style={styles.text}>{item}</Text>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <ActivityIndicator />
        )}
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
