import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-elements";
import ListItem from "../../components/ListItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const CharityListScreen = function ({ navigation }) {
  const [charity, setCharity] = useState([]);
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

  const getCharity = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/charity?page=${page}&limit=10`,
        requestOptions
      );
      const result = await response.json();
      setCode(result?.code);
      if (isMounted) {
        if (result) setCharity([...charity, ...result?.data.result]);
        else setCharity([...charity]);
      }
      setRefreshing(false);
      return () => {
        isMounted = false;
      };
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCharity = async function (id) {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/charity/${id}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.error(err);
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
          deleteCharity(id);
          getCharity();
        },
      },
    ]);
  };

  useEffect(() => {
    getCharity();
  }, [page]);

  const handleRefresh = function () {
    setCharity([]);
    setPage(1);
    setRefreshing(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ECF8FF" }}>
      <View style={styles.container}>
        <FlatList
          data={charity}
          onEndReachedThreshold={0.5}
          ListFooterComponent={checkCodeRenderLoading}
          onEndReached={() => setPage(page + 1)}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                key={index}
                onPress={async () => {
                  await AsyncStorage.setItem("charityId", item.id.toString());
                  navigation.navigate("CharityDetail");
                }}
              >
                <ListItem id={item.id} name={item.charityName} />
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
        title="Thêm Thông Tin Từ Thiện"
        onPress={() => navigation.navigate("CharityCreate")}
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

export default CharityListScreen;
