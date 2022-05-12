import React, { Fragment, useEffect, useState } from "react";
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

const StaffListScreen = function ({ navigation }) {
  // const { data, addStaff } = useContext(Context);
  const [staffs, setStaffs] = useState([]);
  // const [pages, setPages] = useState(0);
  // const [numPage, setNumPage] = useState(1);

  // const getPageArray = function () {
  //   let arr = [];
  //   for (let i = 0; i < pages; i++) {
  //     arr.push(i + 1);
  //   }
  //   return arr;
  // };

  // const getPage = async function (page) {
  //   const token = await AsyncStorage.getItem("accessToken");
  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", `Bearer ${token}`);

  //   var requestOptions = {
  //     method: "GET",
  //     headers: myHeaders,
  //     redirect: "follow",
  //   };
  //   try {
  //     const response = await fetch(
  //       `https://orphanmanagement.herokuapp.com/api/v1/manager/staff?page=${page}`,
  //       requestOptions
  //     );
  //     const result = await response.json();
  //     setStaffs(result.data.result);
  //     setPages(result.data.pages);
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // };

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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/staff/${id}`,
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
        "https://orphanmanagement.herokuapp.com/api/v1/manager/staff/all",
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setStaffs(result.data);
      return () => {
        isMounted = false;
      };
      // console.log(staffs);
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

  useEffect(getStaffs);

  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <ScrollView>
          {staffs ? (
            staffs.map((staff) => {
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  key={staff.staffId}
                  onPress={async () => {
                    await AsyncStorage.setItem(
                      "staffId",
                      staff.staffId.toString()
                    );
                    navigation.navigate("StaffDetail");
                  }}
                >
                  <ListItem
                    id={staff.staffId}
                    key={staff.staffId}
                    name={staff.fullName}
                  />
                  <Button
                    title="Delete"
                    onPress={() => createDeleteDialog(staff.staffId)}
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
        >
          {/* {getPageArray().map((numPage) => {
            return (
              <TouchableOpacity
                key={numPage}
                onPress={() => setNumPage(numPage)}
              >
                <Text
                  style={{
                    margin: 20,
                    padding: 5,
                    backgroundColor: "#ECF8FF",
                  }}
                >
                  {numPage}
                </Text>
              </TouchableOpacity>
            );
          })} */}
        </View>
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
