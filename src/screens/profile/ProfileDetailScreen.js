import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Button, Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import UploadImage from "../../components/UploadImage";

const ProfileDetailScreen = function ({ navigation }) {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getProfile = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/profile/account`,
        requestOptions
      );
      const result = await response.json();
      // setStaff(result.data);
      setIsLoading(true);
      if (isMounted) setProfile(result.data);
      // console.log(nurturer);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(getProfile);

  return (
    <>
      <View style={{ backgroundColor: "#ECF8FF" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileUpdate", profile)}
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
          Thông tin tài khoản cá nhân
        </Text>
      </View>
      {isLoading ? (
        <ScrollView style={styles.content}>
          {profile.image ? <UploadImage img={profile.image} /> : <></>}
          <Text style={styles.text}>Họ và tên: {profile.fullName}</Text>
          <Text style={styles.text}>Ngày sinh: {profile.date_of_birth}</Text>
          <Text style={styles.text}>
            Giới tính: {profile.gender ? "Nam" : "Nữ"}
          </Text>
          <Text style={styles.text}>CMND/CCCD: {profile.identification}</Text>
          <Text style={styles.text}>Số điện thoại: {profile.phone}</Text>
          <Text style={styles.text}>Email: {profile.email}</Text>
          <Text style={styles.text}>Địa chỉ: {profile.address}</Text>
          {profile.roles ? (
            <Text style={styles.text}>
              Quyền hệ thống: {profile.roles[0]?.description}
            </Text>
          ) : (
            <></>
          )}
        </ScrollView>
      ) : (
        <></>
      )}
      <Button
        style={{ flexDirection: "row", justifyContent: "flex-end" }}
        title="Đổi mật khẩu"
        onPress={() => navigation.navigate("ProfileChangePassword")}
      />
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
  textChild: {
    padding: 10,
    paddingLeft: 20,
  },
});

export default ProfileDetailScreen;
