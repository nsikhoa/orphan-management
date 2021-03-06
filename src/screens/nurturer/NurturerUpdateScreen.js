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

const NurturerUpdateScreen = function ({ navigation }) {
  const nurturer = navigation.state.params;

  const [_date, _month, _year] = nurturer.dateOfBirth
    ? nurturer.dateOfBirth.split("/")
    : convertDateToString(new Date()).split("/");
  const [dob, setDob] = useState(new Date(+_year, +_month - 1, +_date));
  const [fullName, setFullName] = useState(nurturer.fullName);
  const [gender, setGender] = useState(nurturer.gender);
  const [dateOfBirth, setDateOfBirth] = useState(nurturer.dateOfBirth);
  const [address, setAddress] = useState(nurturer.address);
  const [email, setEmail] = useState(nurturer.email);
  const [phone, setPhone] = useState(nurturer.phone);
  const [identification, setIdentification] = useState(nurturer.identification);
  const [image, setImage] = useState(nurturer.image);

  const update = async function () {
    const id = await AsyncStorage.getItem("nurturerId");
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      fullName,
      gender,
      dateOfBirth,
      address,
      email,
      phone,
      identification,
      image,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/manager/nurturer/${id}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      if (result.code == 400) {
        if (result.message.includes(":"))
          Alert.alert(
            "Th??ng b??o",
            result.message.slice(
              result.message.indexOf(":") + 2,
              result.message.length - 2
            )
          );
        else Alert.alert("Th??ng b??o", result.message);
      } else if (result.status == 500) {
        Alert.alert("Th??ng b??o", "C???p nh???t kh??ng th??nh c??ng!");
      } else
        Alert.alert("Th??ng b??o", "C???p nh???t th??nh c??ng!", [
          { text: "OK", style: "cancel", onPress: () => navigation.goBack() },
        ]);
    } catch (e) {
      Alert.alert("Th??ng b??o", "D??? li???u nh???p kh??ng h???p l???");
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
          defaultValue={fullName}
          onChangeText={(fullName) => setFullName(fullName)}
          autoCapitalize="words"
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
            <Picker.Item key={0} label="Nam" value={true} />
            <Picker.Item key={1} label="N???" value={false} />
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

        <Text style={styles.label}>S??? ??i???n tho???i: </Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          placeholder="S??? ??i???n tho???i"
          defaultValue={phone}
          onChangeText={(phone) => setPhone(phone)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>?????a ch???: </Text>
        <TextInput
          style={styles.input}
          placeholder="?????a ch???"
          defaultValue={address}
          onChangeText={(address) => setAddress(address)}
          autoCapitalize="words"
        />
      </ScrollView>
      <Button title="C???p nh???t" onPress={update} />
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

export default NurturerUpdateScreen;
