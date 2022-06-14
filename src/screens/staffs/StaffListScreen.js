import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-elements";
import ListItem from "../../components/ListItem";
// import { Context } from "../../context/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const StaffListScreen = function ({ navigation }) {
  const [staffs, setStaffs] = useState([]);
  const [page, setPage] = useState(1);
  const [code, setCode] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  function checkCodeRenderLoading() {
    if (code !== 404)
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    return <></>;
  }

  const deleteStaff = async function (id) {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/employee/${id}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
    } catch (err) {
      throw new Error(err);
    }
  };

  const getStaffs = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/employee?page=${page}&limit=11`,
        requestOptions
      );
      const result = await response.json();
      setCode(result?.code);
      if (isMounted) {
        if (result) setStaffs([...staffs, ...result?.data.result]);
        else setStaffs([...staffs]);
      }
      setRefreshing(false);
      return () => {
        isMounted = false;
      };
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
        onPress: () => deleteStaff(id),
      },
    ]);
  };

  useEffect(getStaffs, [page]);

  const handleRefresh = function () {
    setStaffs([]);
    setPage(1);
    setRefreshing(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <FlatList
          data={staffs}
          keyExtractor={(staff) => staff.id}
          onEndReachedThreshold={0.5}
          ListFooterComponent={checkCodeRenderLoading}
          onEndReached={() => setPage(page + 1)}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={async () => {
                  await AsyncStorage.setItem("staffId", item.id.toString());
                  navigation.navigate("StaffDetail");
                }}
              >
                <ListItem id={item.id} name={item.fullName} />

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
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
        title="Thêm Nhân Viên"
        onPress={() => navigation.navigate("StaffCreate")}
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

export default StaffListScreen;
