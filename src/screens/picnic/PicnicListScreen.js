import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-elements";
import ListItem from "../../components/ListItem";
// import { Context } from "../../context/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const PicnicListScreen = function ({ navigation }) {
  const [picnic, setPicnic] = useState([]);
  const [page, setPage] = useState(1);
  const [code, setCode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getPicnic = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/picnic/all`,
        requestOptions
      );
      const result = await response.json();
      //   setPicnic([...picnic, ...result?.data.result]);
      setPicnic(result?.data);
      //   if (result.code === 200) setTotal(result.data.total);
      //   else setTotal(0);
      setIsLoading(true);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePicnic = async function (id) {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/picnic/${id}`,
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
          deletePicnic(id);
          getPicnic();
        },
      },
    ]);
  };

  useEffect(() => {
    getPicnic();
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <FlatList
          data={picnic}
          // keyExtractor={(child) => child.id}
          onEndReachedThreshold={0.5}
          onEndReached={() => setPage(page + 1)}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                key={index}
                onPress={async () => {
                  await AsyncStorage.setItem("picnicId", item.id.toString());
                  navigation.navigate("PicnicDetail");
                }}
              >
                <ListItem id={item.id} name={item.namePicnic} />
                {/* <Button
                    title="Delete"
                    onPress={() => createDeleteDialog(item.id)}
                  /> */}
                <TouchableOpacity onPress={() => createDeleteDialog(item.id)}>
                  <Feather
                    style={{ top: 5 }}
                    name="trash"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
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
        title="Thêm Thông Tin Dã Ngoại"
        onPress={() => navigation.navigate("PicnicCreate")}
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
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
    padding: 5,
    margin: 5,
    flex: 1,
  },
});

export default PicnicListScreen;
