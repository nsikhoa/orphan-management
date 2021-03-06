import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import UploadImage from "../../components/UploadImage";

const ChildrenDetailScreen = function ({ navigation }) {
  const [children, setChildren] = useState({});
  const [introducer, setIntroducer] = useState({});
  const [nurturer, setNurturer] = useState({});
  const [introducerId, setIntroducerId] = useState(0);
  const [nurturerId, setNurturerId] = useState(0);
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
      // console.log(children);
      setIntroducerId(children.introducerId);
      setNurturerId(children.nurturerId);
      // console.log(introducerId);
      // console.log(nurturerId);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      throw new Error(e);
    }
  };
  useEffect(getChildren);

  const getIntroducer = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/introducer/${introducerId}`,
        requestOptions
      );
      const result = await response.json();
      // setStaff(result.data);
      if (isMounted) setIntroducer(result.data);
      // console.log(introducer);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      throw new Error(e);
    }
  };
  useEffect(getIntroducer);

  const getNuturer = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/nurturer/${nurturerId}`,
        requestOptions
      );
      const result = await response.json();
      // setStaff(result.data);
      if (isMounted) setNurturer(result.data);
      // console.log(nurturer);
      return () => {
        isMounted = false;
      };
    } catch (e) {
      throw new Error(e);
    }
  };
  useEffect(getNuturer);

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
          Th??ng tin tr??? em
        </Text>
      </View>
      {isLoading ? (
        <View style={styles.content}>
          {children.image ? <UploadImage img={children.image} /> : <></>}
          <Text style={styles.text}>H??? v?? t??n: {children.fullName}</Text>
          <Text style={styles.text}>Ng??y sinh: {children.dateOfBirth}</Text>
          <Text style={styles.text}>
            Gi???i t??nh: {children.gender ? "Nam" : "N???"}
          </Text>
          <Text style={styles.text}>
            Ng??y v??o trung t??m: {children.introductoryDate}
          </Text>
          <Text style={styles.text}>
            Ng?????i gi???i thi???u: {introducer ? introducer.fullName : <></>}
          </Text>
          <Text style={styles.text}>
            Tr???ng th??i:{" "}
            {children.status === "WAIT_TO_RECEIVE"
              ? "??ang ??? trung t??m"
              : "???? ???????c nh???n nu??i"}
          </Text>
          {children.status === "RECEIVED" ? (
            <Text style={styles.text}>
              Ng??y ???????c nh???n nu??i: {children.adoptiveDate}
            </Text>
          ) : (
            <></>
          )}
          {children.status === "RECEIVED" ? (
            <Text style={styles.text}>
              Ng?????i nh???n nu??i: {nurturer ? nurturer.fullName : <></>}
            </Text>
          ) : (
            <></>
          )}
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
