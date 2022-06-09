import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import UploadImage from "../../components/UploadImage";

const PicnicDetailScreen = function ({ navigation }) {
  const [picnic, setPicnic] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getPicnic = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    const picnicId = await AsyncStorage.getItem("picnicId");
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/picnic/${picnicId}`,
        requestOptions
      );
      const result = await response.json();
      setIsLoading(true);
      if (isMounted) setPicnic(result.data);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getPicnic();
  });

  return (
    <>
      <View style={{ backgroundColor: "#ECF8FF" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PicnicUpdate", picnic)}
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
          Thông tin sự kiện dã ngoại
        </Text>
      </View>
      {isLoading ? (
        <ScrollView style={styles.content}>
          {picnic.image ? <UploadImage img={picnic.image} /> : <></>}
          <Text style={styles.text}>Tên sự kiện: {picnic.namePicnic}</Text>
          <Text style={styles.text}>Chủ đề: {picnic.title}</Text>
          <Text style={styles.text}>Thời gian bắt đầu: {picnic.dateStart}</Text>
          <Text style={styles.text}>Thời gian kết thúc: {picnic.dateEnd}</Text>
          <Text style={styles.text}>Địa điểm: {picnic.address}</Text>
          <Text style={styles.text}>Nội dung sự kiện: {picnic.content}</Text>
          <Text style={styles.text}>Chi phí: {picnic.money} vnd</Text>
          <Text style={styles.text}>
            Sự kiện: {picnic.isCompleted ? "Chưa diễn ra" : "Đã diễn ra"}
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

export default PicnicDetailScreen;
