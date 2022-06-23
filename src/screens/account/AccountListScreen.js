import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-elements";
import ListItem from "../../components/ListItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const AccountListScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);
  const [total, setTotal] = useState(0);
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

  const getAccounts = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/admin?page=${page}&limit=11`,
        requestOptions
      );
      const result = await response.json();
      setCode(result?.code);
      if (isMounted) {
        if (result) setAccounts([...accounts, ...result?.data.result]);
        else setAccounts([...accounts]);
      }
      if (result.code === 200) setTotal(result.data.total);
      else setTotal(0);
      return () => {
        isMounted = false;
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  const deleteAccountTemp = async function (id) {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/admin/${id}/updateStatus`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
    } catch (err) {
      throw new Error(err);
    }
  };

  const createDeleteDialog = (id) => {
    Alert.alert(
      "Xóa dữ liệu",
      "Dữ liệu sẽ được lưu trữ. Bạn có chắc chắn muốn xóa?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteAccountTemp(id),
        },
      ]
    );
  };

  useEffect(getAccounts, [page]);
  const handleRefresh = function () {
    setAccounts([]);
    setPage(1);
    setRefreshing(true);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button
            title="Tài khoản lưu trữ"
            onPress={() => navigation.navigate("AccountDelete")}
          />
        </View>
        {<Text style={{ bottom: 10 }}>Có {total} kết quả</Text>}
        <FlatList
          data={accounts}
          keyExtractor={(account) => account.id}
          onEndReachedThreshold={0.5}
          ListFooterComponent={checkCodeRenderLoading}
          onEndReached={() => setPage(page + 1)}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={async () => {
                  await AsyncStorage.setItem("accountId", item.id.toString());
                  navigation.navigate("AccountDetail");
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
        title="Thêm Tài Khoản"
        onPress={() => navigation.navigate("AccountCreate")}
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

export default AccountListScreen;
