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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [identification, setIdentification] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(true);
  const [dob, setDob] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState(
    convertDateToString(new Date())
  );
  const [address, setAddress] = useState("");

  const createStaff = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      address,
      dateOfBirth,
      email,
      fullName,
      gender,
      identification,
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
        "https://orphanmanagement.herokuapp.com/api/v1/manager/employee",
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
        Alert.alert("Th??ng b??o", "Th??m kh??ng th??nh c??ng", [
          {
            text: "OK",
          },
        ]);
      } else
        Alert.alert("Th??ng b??o", "Th??m th??nh c??ng", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
    } catch (e) {
      alert("D??? li???u nh???p kh??ng h???p l???");
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
        <Text style={styles.label}>H??? v?? t??n: </Text>
        <TextInput
          style={styles.input}
          placeholder="H??? v?? t??n"
          value={fullName}
          onChangeText={(fullName) => setFullName(fullName)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>?????a ch???: </Text>
        <TextInput
          style={styles.input}
          placeholder="?????a ch???"
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
          value={identification}
          onChangeText={(identification) => setIdentification(identification)}
        />

        <Text style={styles.label}>S??? ??i???n tho???i: </Text>
        <TextInput
          style={styles.input}
          placeholder="S??? ??i???n tho???i"
          value={phone}
          onChangeText={(phone) => setPhone(phone)}
        />

        <Text style={styles.label}>Gi???i t??nh: </Text>
        <View>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => {
              setGender(itemValue);
            }}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item label="Nam" value={true} />
            <Picker.Item label="N???" value={false} />
          </Picker>
        </View>

        <Text style={styles.label}>Ng??y sinh: </Text>
        <DateTimePicker
          value={dob}
          mode="date"
          display="calendar"
          onChange={(e, selectedDate) => {
            setDob(selectedDate);
            setDateOfBirth(convertDateToString(selectedDate));
          }}
        />
      </ScrollView>
      <Button
        title="Th??m nh??n vi??n"
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
