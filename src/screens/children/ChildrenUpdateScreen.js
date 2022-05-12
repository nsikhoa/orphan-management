import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UploadImage from "../../components/UploadImage";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const ChildrenUpdateScreen = function ({ navigation }) {
  const children = navigation.state.params;

  const [_date, _month, _year] = children.dateOfBirth.split("/");
  const [date, month, year] = children.adoptiveDate.split("/");

  const [dob, setDob] = useState(new Date(+_year, +_month - 1, +_date));
  const [ad, setAd] = useState(new Date(+year, +month - 1, +date));
  const [fullName, setFullName] = useState(children.fullName);
  const [gender, setGender] = useState(children.gender);
  const [status, setStatus] = useState(children.status);
  const [dateOfBirth, setDateOfBirth] = useState(children.dateOfBirth);
  const [adoptiveDate, setAdoptiveDate] = useState(children.adoptiveDate);

  const update = async function () {
    const id = await AsyncStorage.getItem("childId");
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      fullName,
      gender,
      dateOfBirth,
      status,
      adoptiveDate,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/manager/children/${id}`,
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

  const convertDateToString = function (selectedDate) {
    const currentDate = selectedDate;
    let date = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    if (date < 10) date = "0" + date;
    if (month < 10) month = "0" + month;
    return date + "/" + month + "/" + year;
  };

  return (
    <KeyboardAwareScrollView extraHeight={150}>
      <ScrollView>
        <Text style={styles.label}>Họ và tên: </Text>
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          defaultValue={fullName}
          onChangeText={(fullName) => setFullName(fullName)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Giới tính: </Text>
        <View>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => {
              setGender(itemValue);
            }}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item label="Nam" value={true} />
            <Picker.Item label="Nữ" value={false} />
          </Picker>
        </View>

        <Text style={styles.label}>Ngày sinh: </Text>
        <DateTimePicker
          value={dob}
          mode="date"
          display="calendar"
          onChange={(e, selectedDate) => {
            setDob(selectedDate);
            setDateOfBirth(convertDateToString(selectedDate));
          }}
        />

        <Text style={styles.label}>Ngày nhận nuôi: </Text>
        <DateTimePicker
          value={ad}
          mode="date"
          display="calendar"
          onChange={(e, selectedDate) => {
            setAd(selectedDate);
            setAdoptiveDate(convertDateToString(selectedDate));
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
            <Picker.Item label="Đang ở trung tâm" value="WAIT_TO_RECEIVE" />
            <Picker.Item label="Đã được nhận nuôi" value="RECEIVED" />
          </Picker>
        </View>
      </ScrollView>
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

export default ChildrenUpdateScreen;
