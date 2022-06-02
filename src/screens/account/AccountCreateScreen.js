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

const AccountCreateScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState(true);
  const [identification, setIdentification] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [dob, setDob] = useState(new Date());
  const [date_of_birth, setDateOfBirth] = useState(
    convertDateToString(new Date())
  );

  const createAccount = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      date_of_birth,
      fullName,
      gender,
      identification,
      phone,
      email,
      address,
      password,
      confirmPassword,
      image: "",
      roles: [role],
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "https://orphanmanagement.herokuapp.com/api/v1/admin",
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
        else Alert.alert("Thông báo", result.message);
      } else
        Alert.alert("Thông báo", "Thêm thành công", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
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
          value={fullName}
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
            <Picker.Item key={1} label="Nam" value={true} />
            <Picker.Item key={0} label="Nữ" value={false} />
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
          keyboardType="numeric"
          style={styles.input}
          placeholder="CMND/CCCD"
          value={identification}
          onChangeText={(identification) => setIdentification(identification)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Email: </Text>
        <TextInput
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Số điện thoại: </Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={(phone) => setPhone(phone)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Địa chỉ: </Text>
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={address}
          onChangeText={(address) => setAddress(address)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Quyền hệ thống: </Text>
        <View>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue, itemIndex) => {
              setRole(itemValue);
            }}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item key={0} label="Quản trị viên" value="ROLE_ADMIN" />
            <Picker.Item
              key={1}
              label="Quản lý hoạt động trung tâm"
              value="ROLE_MANAGER_LOGISTIC"
            />
            <Picker.Item
              key={2}
              label="Quản lý nhân sự"
              value="ROLE_MANAGER_HR"
            />
            <Picker.Item
              key={3}
              label="Quản lý trẻ em"
              value="ROLE_MANAGER_CHILDREN"
            />
            <Picker.Item key={4} label="Nhân viên" value="ROLE_EMPLOYEE" />
          </Picker>
        </View>

        <Text style={styles.label}>Mật khẩu: </Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Xác nhận mật khẩu: </Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
          autoCapitalize="none"
        />
        {password !== confirmPassword ? (
          <Text style={{ color: "red", fontSize: 14 }}>
            Mật khẩu không khớp
          </Text>
        ) : (
          <></>
        )}
      </ScrollView>
      <Button
        title="Thêm Tài Khoản"
        onPress={() => {
          createAccount();
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

export default AccountCreateScreen;
