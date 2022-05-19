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
} from "react-native";
import { Button } from "react-native-elements";
import ListItem from "../../components/ListItem";
// import { Context } from "../../context/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const ChildrenListScreen = function ({ navigation }) {
  const [children, setChildren] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [code, setCode] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/children?page=${page}`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setChildren(result?.data.result);
      if (result.code === 200) setTotal(result.data.total);
      else setTotal(0);
      setCode(result.code);
      setIsLoading(true);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      console.error(err);
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

  const search = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      keyword,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/manager/children/search?page=${page}`,
        requestOptions
      );
      const results = await response.json();
      console.log(page);
      if (!keyword) {
        setPage(1);
      }
      if (results.code === 200) setTotal(results.data.total);
      else setTotal(0);

      if (results.code === 200) setChildren(results.data.result);
      else setChildren([]);
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
          deleteChild(id);
          getChildren();
        },
      },
    ]);
  };

  useEffect(() => {
    getChildren();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên cần tìm kiếm"
            value={keyword}
            onChangeText={(keyword) => {
              setKeyword(keyword);
              // if (keyword) setPage(0);
              // else setPage(1);
            }}
            autoCapitalize="words"
          />
          <TouchableOpacity onPress={search}>
            <Feather name="search" size={41} color="black" />
          </TouchableOpacity>
        </View>
        {<Text style={{ bottom: 10 }}>Có {total} kết quả</Text>}
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
                  {/* <Button
                    title="Delete"
                    onPress={() => createDeleteDialog(child.id)}
                  /> */}
                  <TouchableOpacity
                    onPress={() => createDeleteDialog(child.id)}
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
          {total > 5 ? (
            <View>
              {page === 1 ? (
                <View
                  style={{
                    top: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    title="Next Page"
                    onPress={() => {
                      setPage(page + 1);
                      if (keyword) {
                        search();
                      } else {
                        getChildren();
                      }
                    }}
                  />
                </View>
              ) : page !== 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    top: 10,
                  }}
                >
                  <Button
                    title="Prev Page"
                    onPress={() => {
                      setPage(page - 1);
                      if (keyword) {
                        search();
                      } else {
                        getChildren();
                      }
                    }}
                  />
                  {page === children.pages ? (
                    <></>
                  ) : (
                    <Button
                      title="Next Page"
                      onPress={() => {
                        setPage(page + 1);
                        if (keyword) {
                          search();
                        } else {
                          getChildren();
                        }
                      }}
                    />
                  )}
                </View>
              ) : (
                <></>
              )}
            </View>
          ) : (
            <></>
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

export default ChildrenListScreen;
