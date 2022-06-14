import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import UploadImage from "../../components/UploadImage";

const CharityDetailScreen = function ({ navigation }) {
  const [charity, setCharity] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getCharity = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    const charityId = await AsyncStorage.getItem("charityId");
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/charity/${charityId}`,
        requestOptions
      );
      const result = await response.json();
      setIsLoading(true);
      if (isMounted) setCharity(result.data);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getCharity();
  });

  return (
    <>
      <View style={{ backgroundColor: "#ECF8FF" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CharityUpdate", charity)}
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
          Thông tin sự kiện từ thiện
        </Text>
      </View>
      {isLoading ? (
        <ScrollView style={styles.content}>
          {charity.image ? <UploadImage img={charity.image} /> : <></>}
          <Text style={styles.text}>Tên sự kiện: {charity.charityName}</Text>
          <Text style={styles.text}>Chủ đề: {charity.title}</Text>
          <Text style={styles.text}>
            Thời gian bắt đầu: {charity.dateStart}
          </Text>
          <Text style={styles.text}>Thời gian kết thúc: {charity.dateEnd}</Text>
          <Text style={styles.text}>Nội dung sự kiện: {charity.content}</Text>
          <Text style={styles.text}>
            Tổng đóng góp: {charity.totalDonation ? charity.totalDonation : "0"}{" "}
            vnd
          </Text>
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

export default CharityDetailScreen;
