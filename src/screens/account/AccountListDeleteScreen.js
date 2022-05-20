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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const AccountListDeleteScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);

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
        "https://orphanmanagement.herokuapp.com/api/v1/admin/all/deleted",
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setAccounts(result.data);
      return () => {
        isMounted = false;
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  const restoreAccountTemp = async function (id) {
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

  const deleteAccount = async function (id) {
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
        `https://orphanmanagement.herokuapp.com/api/v1/admin/${id}`,
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
      "Dữ liệu sẽ xóa vĩnh viễn. Bạn có chắc chắn muốn xóa?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteAccount(id),
        },
      ]
    );
  };

  const restoreDialog = (id) => {
    Alert.alert(
      "Khôi phục dữ liệu",
      "Bạn có chắc chắn muốn khôi phục dữ liệu?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => restoreAccountTemp(id),
        },
      ]
    );
  };

  useEffect(getAccounts);
  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <ScrollView>
          {accounts ? (
            accounts.map((account) => {
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  key={account.id}
                  onPress={async () => {
                    await AsyncStorage.setItem(
                      "accountId",
                      account.id.toString()
                    );
                    navigation.navigate("AccountDetail");
                  }}
                >
                  <ListItem
                    id={account.id}
                    key={account.id}
                    name={account.fullName}
                  />
                  <TouchableOpacity onPress={() => restoreDialog(account.id)}>
                    <AntDesign
                      style={{ top: 6, right: 15 }}
                      name="sync"
                      size={22}
                      color="black"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => createDeleteDialog(account.id)}
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

export default AccountListDeleteScreen;
