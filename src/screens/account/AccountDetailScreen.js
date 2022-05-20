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

const AccountDetailScreen = function ({ navigation }) {
  const [account, setAccount] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getAccount = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    const accountId = await AsyncStorage.getItem("accountId");
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
        `https://orphanmanagement.herokuapp.com/api/v1/admin/${accountId}`,
        requestOptions
      );
      const result = await response.json();
      // setStaff(result.data);
      setIsLoading(true);
      if (isMounted) setAccount(result.data);
      // console.log(nurturer);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(getAccount);

  return (
    <>
      <View style={{ backgroundColor: "#ECF8FF" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AccountUpdate", account)}
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
          Thông tin tài khoản
        </Text>
      </View>
      {isLoading ? (
        <ScrollView style={styles.content}>
          {account.image ? <UploadImage img={account.image} /> : <></>}
          <Text style={styles.text}>Họ và tên: {account.fullName}</Text>
          <Text style={styles.text}>Ngày sinh: {account.date_of_birth}</Text>
          <Text style={styles.text}>
            Giới tính: {account.gender ? "Nam" : "Nữ"}
          </Text>
          <Text style={styles.text}>CMND/CCCD: {account.identification}</Text>
          <Text style={styles.text}>Số điện thoại: {account.phone}</Text>
          <Text style={styles.text}>Email: {account.email}</Text>
          <Text style={styles.text}>Địa chỉ: {account.address}</Text>
          {account.roles ? (
            <Text style={styles.text}>
              Quyền hệ thống: {account.roles[0]?.description}
            </Text>
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

export default AccountDetailScreen;
