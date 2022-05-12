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
  console.log(furniture);
  const [nameFurniture, setNameFurniture] = useState(furniture.nameFurniture);
  const [status, setStatus] = useState(furniture.status);
  const [quantity, setQuantity] = useState(furniture.quantity);

  const update = async function () {
    const id = await AsyncStorage.getItem("furnitureId");
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      image: "",
      nameFurniture,
      quantity,
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
      console.log(result);
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

        <Text style={styles.label}>Số lượng: </Text>
        <TextInput
          style={styles.input}
          placeholder="Số lượng"
          defaultValue={furniture.quantity.toString()}
          onChangeText={(quantity) => {
            setQuantity(Number(quantity));
          }}
        />

        <Text style={styles.label}>Trạng thái: </Text>
        <View>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue, itemIndex) => {
              setStatus(itemValue);
            }}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item label="Sử dụng tốt" value="GOOD" />
            <Picker.Item label="Có hư hỏng" value="NEED_FIX" />
          </Picker>
        </View>
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
