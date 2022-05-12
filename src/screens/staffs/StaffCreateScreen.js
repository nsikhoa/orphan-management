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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const StaffCreateScreen = function ({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [idCard, setIdCard] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [typeStaff, setTypeStaff] = useState("NhanVien");

  const createStaff = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      address,
      date_of_birth: dateOfBirth,
      email,
      fullName,
      gender,
      identification: idCard,
      phone,
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
        "https://orphanmanagement.herokuapp.com/api/v1/manager/staff",
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
      } else if (result.status === 500) {
        Alert.alert("Thông báo", "Thêm không thành công", [
          {
            text: "OK",
          },
        ]);
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
      <ScrollView>
        <Text style={styles.label}>Họ và tên: </Text>
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={(fullName) => setFullName(fullName)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Địa chỉ: </Text>
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={address}
          onChangeText={(address) => setAddress(address)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email: </Text>
        <TextInput
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />

        <Text style={styles.label}>CMND/CCCD: </Text>
        <TextInput
          style={styles.input}
          placeholder="CMND/CCCD"
          value={idCard}
          onChangeText={(idCard) => setIdCard(idCard)}
        />

        <Text style={styles.label}>Số điện thoại: </Text>
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={(phone) => setPhone(phone)}
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
          value={date}
          mode="date"
          display="calendar"
          onChange={(e, selectedDate) => {
            const currentDate = selectedDate;
            let date = currentDate.getDate();
            let month = currentDate.getMonth() + 1;
            let year = currentDate.getFullYear();
            if (date < 10) date = "0" + date;
            if (month < 10) month = "0" + month;
            let dob = "";

            dob = date + "/" + month + "/" + year;
            setDate(currentDate);
            setDateOfBirth(dob);
          }}
        />

        {/* <Text style={styles.label}>Loại nhân viên: </Text>
        <View>
          <Picker
            selectedValue={typeStaff}
            onValueChange={(itemValue, itemIndex) => {
              setTypeStaff(itemValue);
            }}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item label="Nhân viên" value="NhanVien" />
            <Picker.Item label="Cán bộ" value="CanBo" />
          </Picker>
        </View> */}
      </ScrollView>
      <Button
        title="Thêm nhân viên"
        onPress={() => {
          createStaff();
        }}
      />
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

export default StaffCreateScreen;
