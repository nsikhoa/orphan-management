import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const ProfileChangePasswordScreen = function ({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      currentPassword,
      confirmPassword,
      newPassword,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/profile/account/changepassword`,
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
        Alert.alert("Thông báo", "Đổi mật khẩu không thành công!");
      } else
        Alert.alert("Thông báo", "Đổi mật khẩu thành công!", [
          { text: "OK", style: "cancel", onPress: () => navigation.goBack() },
        ]);
    } catch (e) {
      Alert.alert("Thông báo", "Dữ liệu nhập không hợp lệ");
    }
  };

  return (
    <KeyboardAwareScrollView extraHeight={150}>
      <ScrollView>
        <Text style={styles.label}>Mật khẩu hiện tại: </Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Mật khẩu hiện tại"
          defaultValue={currentPassword}
          onChangeText={(currentPassword) =>
            setCurrentPassword(currentPassword)
          }
          autoCapitalize="none"
        />

        <Text style={styles.label}>Nhập mật khẩu mới: </Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Mật khẩu mới"
          defaultValue={newPassword}
          onChangeText={(newPassword) => setNewPassword(newPassword)}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Xác nhận mật khẩu: </Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Xác nhận mật khẩu"
          defaultValue={confirmPassword}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
          autoCapitalize="none"
        />
      </ScrollView>
      <Button title="Đổi mật khẩu" onPress={changePassword} />
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

export default ProfileChangePasswordScreen;
