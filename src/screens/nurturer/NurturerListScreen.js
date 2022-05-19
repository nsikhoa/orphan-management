import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Button } from "react-native-elements";
import ListItem from "../../components/ListItem";
// import { Context } from "../../context/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const NurturerListScreen = function ({ navigation }) {
  const [nurturers, setNurturer] = useState([]);
  const [page, setPage] = useState(1);
  const [code, setCode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getNurturers = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/nurturer/all`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setNurturer(result.data);
      setCode(result.code);
      setIsLoading(true);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      throw new Error(err);
    }
  };

  const deleteNurturer = async function (id) {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/manager/nurturer/${id}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
    } catch (err) {
      throw new Error(err);
    }
  };

  const createDeleteDialog = (id) => {
    Alert.alert("Xóa dữ liệu", "Bạn có chắc chắn muốn xóa?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteNurturer(id);
          getNurturers();
        },
      },
    ]);
  };

  useEffect(getNurturers);
  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <ScrollView>
          {nurturers ? (
            nurturers.map((nurturer) => {
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  key={nurturer.id}
                  onPress={async () => {
                    await AsyncStorage.setItem(
                      "nurturerId",
                      nurturer.id.toString()
                    );
                    navigation.navigate("NurturerDetail");
                  }}
                >
                  <ListItem
                    id={nurturer.id}
                    key={nurturer.id}
                    name={nurturer.fullName}
                  />
                  {/* <Button
                    title="Delete"
                    onPress={() => createDeleteDialog(child.id)}
                  /> */}
                  <TouchableOpacity
                    onPress={() => createDeleteDialog(nurturer.id)}
                  >
                    <Feather
                      style={{ top: 5 }}
                      name="trash"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text
              style={{
                textAlign: "center",
                fontStyle: "italic",
                marginTop: 15,
              }}
            >
              Chưa có dữ liệu
            </Text>
          )}
        </ScrollView>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "center",
          }}
        ></View>
      </View>
      <Button
        buttonStyle={{
          alignSelf: "flex-end",
          right: 8,
          top: 0,
          paddingLeft: 30,
          paddingRight: 30,
        }}
        title="Thêm Người Nhận Nuôi"
        onPress={() => navigation.navigate("NurturerCreate")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    shadowColor: "#e8e8e8",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  itemContainer: {
    borderTopWidth: 1,
    borderTopColor: "gray",
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 1,
  },
});

export default NurturerListScreen;
