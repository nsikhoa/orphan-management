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

const FurnitureCreateScreen = ({ navigation }) => {
  const [nameFurniture, setNameFurniture] = useState("");
  const [status, setStatus] = useState("");
  const [goodQuantity, setGoodQuantity] = useState(0);
  const [brokenQuantity, setBrokenQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const createFurniture = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      nameFurniture,
      status,
      goodQuantity,
      brokenQuantity,
      unitPrice,
      image: "",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "https://orphanmanagement.herokuapp.com/api/v1/manager/furniture",
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      if (result.code == 400) {
        if (result.message.includes(":"))
          alert(
            result.message.slice(
              result.message.indexOf(":") + 2,
              result.message.length - 2
            )
          );
        else alert(result.message);
      } else
        Alert.alert("Thông báo", "Thêm thành công", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
    } catch (e) {
      alert("Dữ liệu nhập không hợp lệ");
    }
  };
  return (
    <KeyboardAwareScrollView extraHeight={150}>
      <View>
        <Text style={styles.label}>Tên trang thiết bị: </Text>
        <TextInput
          style={styles.input}
          placeholder="Tên trang thiết bị"
          value={nameFurniture}
          onChangeText={(nameFurniture) => setNameFurniture(nameFurniture)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Số lượng sử dụng tốt: </Text>
        <TextInput
          style={styles.input}
          placeholder="Số lượng sử dụng tốt"
          value={goodQuantity.toString()}
          keyboardType="numeric"
          onChangeText={(goodQuantity) => {
            setGoodQuantity(Number(goodQuantity));
          }}
        />

        <Text style={styles.label}>Số lượng hư hỏng: </Text>
        <TextInput
          style={styles.input}
          placeholder="Số lượng hư hỏng"
          value={brokenQuantity.toString()}
          keyboardType="numeric"
          onChangeText={(brokenQuantity) => {
            setBrokenQuantity(Number(brokenQuantity));
          }}
        />

        <Text style={styles.label}>Đơn giá: </Text>
        <TextInput
          style={styles.input}
          placeholder="Đơn giá"
          value={unitPrice.toString()}
          keyboardType="numeric"
          onChangeText={(unitPrice) => {
            setUnitPrice(Number(unitPrice));
          }}
        />

        <Text style={styles.label}>Ghi chú: </Text>
        <TextInput
          style={styles.input}
          placeholder="Ghi chú"
          value={status}
          onChangeText={(status) => {
            setStatus(status);
          }}
        />
      </View>
      <Button title="Thêm trang thiết bị" onPress={createFurniture} />
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

export default FurnitureCreateScreen;
