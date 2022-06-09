import React, { useEffect, useState } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const ProfileUpdateScreen = function ({ navigation }) {
  const profile = navigation.state.params;

  const [_date, _month, _year] = profile.date_of_birth
    ? profile.date_of_birth.split("/")
    : convertDateToString(new Date()).split("/");
  const [dob, setDob] = useState(new Date(+_year, +_month - 1, +_date));
  const [fullName, setFullName] = useState(profile.fullName);
  const [gender, setGender] = useState(profile.gender);
  const [dateOfBirth, setDateOfBirth] = useState(profile.date_of_birth);
  const [address, setAddress] = useState(profile.address);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [identification, setIdentification] = useState(profile.identification);
  const [image, setImage] = useState(profile.image);

  const update = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    console.log(profile);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      fullName,
      gender,
      date_of_birth: dateOfBirth,
      address,
      email,
      phone,
      identification,
      image,
      roles: profile.roles,
      recoveryExpirationDate: null,
      userStatus: profile.userStatus,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/profile/account`,
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
      } else if (result.status == 500 || result.status == 405) {
        Alert.alert("Thông báo", "Cập nhật không thành công!");
      } else
        Alert.alert("Thông báo", "Cập nhật thành công!", [
          { text: "OK", style: "cancel", onPress: () => navigation.goBack() },
        ]);
    } catch (e) {
      Alert.alert("Thông báo", "Dữ liệu nhập không hợp lệ");
    }
  };

  function convertDateToString(selectedDate) {
    const currentDate = selectedDate;
    let date = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    if (date < 10) date = "0" + date;
    if (month < 10) month = "0" + month;
    return date + "/" + month + "/" + year;
  }

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
            <Picker.Item key={0} label="Nam" value={true} />
            <Picker.Item key={1} label="Nữ" value={false} />
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

        <Text style={styles.label}>CMND/CCCD: </Text>
        <TextInput
          style={styles.input}
          placeholder="CMND/CCCD"
          defaultValue={identification}
          onChangeText={(identification) => setIdentification(identification)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email: </Text>
        <TextInput
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
          defaultValue={email}
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Số điện thoại: </Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          placeholder="Số điện thoại"
          defaultValue={phone}
          onChangeText={(phone) => setPhone(phone)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Địa chỉ: </Text>
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          defaultValue={address}
          onChangeText={(address) => setAddress(address)}
          autoCapitalize="words"
        />
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

export default ProfileUpdateScreen;
