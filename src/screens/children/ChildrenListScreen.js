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

const ChildrenListScreen = function ({ navigation }) {
  const [children, setChildren] = useState([]);
  const [code, setCode] = useState(0);

  const getChildren = async function () {
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
        "https://orphanmanagement.herokuapp.com/api/v1/manager/children/all",
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setChildren(result.data);
      setCode(result.code);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      throw new Error(err);
    }
  };

  const deleteChild = async function (id) {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/children/${id}`,
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
        onPress: () => deleteChild(id),
      },
    ]);
  };

  useEffect(getChildren);
  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <ScrollView>
          {children ? (
            children.map((child) => {
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  key={child.id}
                  onPress={async () => {
                    await AsyncStorage.setItem("childId", child.id.toString());
                    navigation.navigate("ChildrenDetail");
                  }}
                >
                  <ListItem
                    id={child.id}
                    key={child.id}
                    name={child.fullName}
                  />
                  <Button
                    title="Delete"
                    onPress={() => createDeleteDialog(child.id)}
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
        title="Thêm Trẻ Em"
        onPress={() => navigation.navigate("ChildrenCreate")}
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

export default ChildrenListScreen;