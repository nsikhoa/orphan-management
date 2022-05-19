import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import UploadImage from "../../components/UploadImage";

const NurturerDetailScreen = function ({ navigation }) {
  const [nurturer, setNurturer] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getNuturer = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    const nurturerId = await AsyncStorage.getItem("nurturerId");
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/nurturer/${nurturerId}`,
        requestOptions
      );
      const result = await response.json();
      // setStaff(result.data);
      setIsLoading(true);
      if (isMounted) setNurturer(result.data);
      // console.log(nurturer);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(getNuturer);

  return (
    <>
      <View style={{ backgroundColor: "#ECF8FF" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("NurturerUpdate", nurturer)}
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
          Thông tin người nhận nuôi
        </Text>
      </View>
      {isLoading ? (
        <ScrollView style={styles.content}>
          {nurturer.image ? <UploadImage img={nurturer.image} /> : <></>}
          <Text style={styles.text}>Họ và tên: {nurturer.fullName}</Text>
          <Text style={styles.text}>Ngày sinh: {nurturer.dateOfBirth}</Text>
          <Text style={styles.text}>
            Giới tính: {nurturer.gender ? "Nam" : "Nữ"}
          </Text>
          <Text style={styles.text}>CMND/CCCD: {nurturer.identification}</Text>
          <Text style={styles.text}>Số điện thoại: {nurturer.phone}</Text>
          <Text style={styles.text}>Email: {nurturer.email}</Text>
          <Text style={styles.text}>Địa chỉ: {nurturer.address}</Text>
          {nurturer.childrens ? (
            <View>
              <Text style={styles.text}>
                Số lượng trẻ em nhận nuôi: {nurturer.childrens.length}{" "}
              </Text>
              <Text style={styles.text}>
                Các trẻ em nhận nuôi:
                {nurturer.childrens.map((child) => {
                  return (
                    <View style={styles.textChild} key={child.id}>
                      <Text>Họ và tên: {child.fullName}</Text>
                      <Text>Ngày sinh: {child.dateOfBirth}</Text>
                      <Text>Giới tính: {child.gender ? "Nam" : "Nữ"}</Text>
                    </View>
                  );
                })}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </ScrollView>
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
  textChild: {
    padding: 10,
    paddingLeft: 20,
  },
});

export default NurturerDetailScreen;
