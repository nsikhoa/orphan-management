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

const IntroducerDetailScreen = function ({ navigation }) {
  const [introducer, setIntroducer] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getIntroducer = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    const introducerId = await AsyncStorage.getItem("introducerId");
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/introducer/${introducerId}`,
        requestOptions
      );
      const result = await response.json();
      // setStaff(result.data);
      setIsLoading(true);
      if (isMounted) setIntroducer(result.data);
      // console.log(nurturer);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(getIntroducer);

  return (
    <>
      <View style={{ backgroundColor: "#ECF8FF" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("IntroducerUpdate", introducer)}
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
          Thông tin người giới thiệu
        </Text>
      </View>
      {isLoading ? (
        <ScrollView style={styles.content}>
          {introducer.image ? <UploadImage img={introducer.image} /> : <></>}
          <Text style={styles.text}>Họ và tên: {introducer.fullName}</Text>
          <Text style={styles.text}>Ngày sinh: {introducer.dateOfBirth}</Text>
          <Text style={styles.text}>
            Giới tính: {introducer.gender ? "Nam" : "Nữ"}
          </Text>
          <Text style={styles.text}>
            CMND/CCCD: {introducer.identification}
          </Text>
          <Text style={styles.text}>Số điện thoại: {introducer.phone}</Text>
          <Text style={styles.text}>Email: {introducer.email}</Text>
          <Text style={styles.text}>Địa chỉ: {introducer.address}</Text>
          {introducer.childrens ? (
            <View>
              <Text style={styles.text}>
                Số lượng trẻ em giới thiệu: {introducer.childrens.length}{" "}
              </Text>
              {introducer.childrens.length ? (
                <Text style={styles.text}>
                  Các trẻ em giới thiệu:
                  {introducer.childrens.map((child) => {
                    return (
                      <View style={styles.textChild} key={child.id}>
                        <Text>Họ và tên: {child.fullName}</Text>
                        <Text>Ngày sinh: {child.dateOfBirth}</Text>
                        <Text>Giới tính: {child.gender ? "Nam" : "Nữ"}</Text>
                      </View>
                    );
                  })}
                </Text>
              ) : (
                <></>
              )}
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

export default IntroducerDetailScreen;
