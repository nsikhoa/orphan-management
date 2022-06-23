import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const FurnitureUpdateScreen = ({ navigation }) => {
  const furniture = navigation.state.params;
  const [nameFurniture, setNameFurniture] = useState(furniture.nameFurniture);
  const [status, setStatus] = useState(furniture.status);
  const [goodQuantity, setGoodQuantity] = useState(furniture.goodQuantity);
  const [brokenQuantity, setBrokenQuantity] = useState(
    furniture.brokenQuantity
  );
  const [unitPrice, setUnitPrice] = useState(furniture.unitPrice);

  const update = async function () {
    const id = await AsyncStorage.getItem("furnitureId");
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      image: "",
      nameFurniture,
      goodQuantity,
      brokenQuantity,
      unitPrice,
      status,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/manager/furniture/${id}`,
        requestOptions
      );
      const result = await response.json();
      if (result.code == 400) {
        if (result.message.includes(":"))
          Alert.alert(
            "Thông báo",
            result.message.slice(
              result.message.indexOf(":") + 2,
              result.message.length - 2
            )
          );
        else Alert.alert("Thông báo", result.message);
      } else if (result.status == 500) {
        Alert.alert("Thông báo", "Cập nhật không thành công!");
      } else
        Alert.alert("Thông báo", "Cập nhật thành công!", [
          { text: "OK", style: "cancel", onPress: () => navigation.goBack() },
        ]);
    } catch (e) {
      Alert.alert("Thông báo", "Dữ liệu nhập không hợp lệ");
    }
  };

  return (
    <KeyboardAwareScrollView extraHeight={150}>
      <View>
        <Text style={styles.label}>Tên trang thiết bị: </Text>
        <TextInput
          style={styles.input}
          placeholder="Tên trang thiết bị"
          defaultValue={furniture.nameFurniture}
          onChangeText={(nameFurniture) => setNameFurniture(nameFurniture)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Số lượng sử dụng tốt: </Text>
        <TextInput
          style={styles.input}
          placeholder="Số lượng sử dụng tốt"
          defaultValue={furniture.goodQuantity.toString()}
          onChangeText={(goodQuantity) => {
            setGoodQuantity(Number(goodQuantity));
          }}
        />

        <Text style={styles.label}>Số lượng hư hỏng: </Text>
        <TextInput
          style={styles.input}
          placeholder="Số lượng hư hỏng"
          defaultValue={furniture.brokenQuantity.toString()}
          onChangeText={(brokenQuantity) => {
            setBrokenQuantity(Number(brokenQuantity));
          }}
        />

        <Text style={styles.label}>Đơn giá: </Text>
        <TextInput
          style={styles.input}
          placeholder="Đơn giá"
          defaultValue={furniture.unitPrice.toString()}
          onChangeText={(unitPrice) => {
            setUnitPrice(Number(unitPrice));
          }}
        />

        <Text style={styles.label}>Tình trạng: </Text>
        <TextInput
          style={styles.input}
          placeholder="Ghi chú"
          value={status}
          onChangeText={(status) => {
            setStatus(status);
          }}
        />
      </View>
      <Button title="Cập nhật" onPress={update} />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
    padding: 5,
    margin: 5,
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default FurnitureUpdateScreen;
