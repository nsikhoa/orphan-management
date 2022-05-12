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

const FurnitureListScreen = ({ navigation }) => {
  const [furnitures, setFurnitures] = useState([]);

  const getFurniture = async function () {
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
        "https://orphanmanagement.herokuapp.com/api/v1/manager/furniture/all",
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setFurnitures(result.data);
      // setCode(result.code);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(getFurniture);

  const deleteFurniture = async function (id) {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/furniture/${id}`,
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
        onPress: () => deleteFurniture(id),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <ScrollView>
          {furnitures ? (
            furnitures.map((furniture) => {
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  key={furniture.furnitureId}
                  onPress={async () => {
                    await AsyncStorage.setItem(
                      "furnitureId",
                      furniture.furnitureId.toString()
                    );
                    navigation.navigate("FurnitureDetail");
                  }}
                >
                  <ListItem
                    id={furniture.furnitureId}
                    key={furniture.furnitureId}
                    name={furniture.nameFurniture}
                  />
                  <Button
                    title="Delete"
                    onPress={() => createDeleteDialog(furniture.furnitureId)}
                  />
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
        title="Thêm Trang Thiết Bị"
        onPress={() => navigation.navigate("FurnitureCreate")}
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

export default FurnitureListScreen;
