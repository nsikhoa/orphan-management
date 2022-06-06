import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import UploadImage from "../../components/UploadImage";

const StaffDetailScreen = function ({ navigation }) {
  const [staff, setStaff] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getStaff = async function () {
    const id = await AsyncStorage.getItem("staffId");
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/employee/${id}`,
        requestOptions
      );
      const result = await response.json();
      setIsLoading(true);
      if (isMounted) setStaff(result.data);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      throw new Error(e);
    }
  };
  useEffect(getStaff);
  return (
    <>
      <View style={{ backgroundColor: "#ECF8FF" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("StaffUpdate", staff)}
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
          Thông tin nhân viên, cán bộ
        </Text>
      </View>
      {isLoading ? (
        <View style={styles.content}>
          {staff.image ? <UploadImage img={staff.image} /> : <></>}
          <Text style={styles.text}>Họ và tên: {staff.fullName}</Text>
          <Text style={styles.text}>Địa chỉ: {staff.address}</Text>
          <Text style={styles.text}>
            Giới tính: {staff.gender ? "Nam" : "Nữ"}
          </Text>
          <Text style={styles.text}>CMND: {staff.identification}</Text>
          <Text style={styles.text}>Ngày sinh: {staff.date_of_birth}</Text>
          <Text style={styles.text}>Số điện thoại: {staff.phone}</Text>
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

export default StaffDetailScreen;
