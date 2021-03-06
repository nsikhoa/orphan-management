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

const ChildrenUpdateScreen = function ({ navigation }) {
  const children = navigation.state.params;
  // console.log(children);

  const [_date, _month, _year] = children.dateOfBirth
    ? children.dateOfBirth.split("/")
    : convertDateToString(new Date()).split("/");
  const [date, month, year] = children.adoptiveDate
    ? children.adoptiveDate.split("/")
    : convertDateToString(new Date()).split("/");
  const [date_, month_, year_] = children.introductoryDate
    ? children.introductoryDate.split("/")
    : convertDateToString(new Date()).split("/");

  const [introducers, setIntroducer] = useState([]);
  const [nurturers, setNurturers] = useState([]);
  const [dob, setDob] = useState(new Date(+_year, +_month - 1, +_date));
  const [ad, setAd] = useState(new Date(+year, +month - 1, +date));
  const [idate, setIdate] = useState(new Date(+year_, +month_ - 1, +date_));
  const [fullName, setFullName] = useState(children.fullName);
  const [gender, setGender] = useState(children.gender);
  const [status, setStatus] = useState(children.status);
  const [dateOfBirth, setDateOfBirth] = useState(children.dateOfBirth);
  const [adoptiveDate, setAdoptiveDate] = useState(children.adoptiveDate || "");
  const [introductoryDate, setIntroductoryDate] = useState(
    children.introductoryDate || ""
  );
  const [introducerId, setIntroducerId] = useState(children.introducerId || 0);
  const [nurturerId, setNurturerId] = useState(children.nurturerId || 0);
  const [image, setImage] = useState(children.image);

  const update = async function () {
    const id = await AsyncStorage.getItem("childId");
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      image,
      fullName,
      gender,
      dateOfBirth,
      adoptiveDate,
      introductoryDate,
      introducerId,
      nurturerId,
      // status,
    });
    console.log(raw);

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

  const getIntroducer = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    let isMounted = true;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      "https://orphanmanagement.herokuapp.com/api/v1/manager/introducer/all",
      requestOptions
    );
    const result = await response.json();
    if (isMounted) setIntroducer(result.data);
    // console.log(introducers);
    return () => {
      isMounted = false;
    };
  };

  useEffect(getIntroducer, []);

  const getNuturer = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    let isMounted = true;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      "https://orphanmanagement.herokuapp.com/api/v1/manager/nurturer/all",
      requestOptions
    );
    const result = await response.json();
    if (isMounted) setNurturers(result.data);
    // console.log(introducers);
    return () => {
      isMounted = false;
    };
  };

  useEffect(getNuturer, []);

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

        <Text style={styles.label}>Ng??y ???????c gi???i thi???u: </Text>
        <DateTimePicker
          value={idate}
          mode="date"
          display="calendar"
          onChange={(e, selectedDate) => {
            setIdate(selectedDate);
            setIntroductoryDate(convertDateToString(selectedDate));
          }}
        />

        <Text style={styles.label}>Ng?????i gi???i thi???u: </Text>
        <View>
          <Picker
            selectedValue={introducerId}
            onValueChange={(itemValue, itemIndex) => {
              setIntroducerId(itemValue);
            }}
            itemStyle={{ height: 120 }}
          >
            {introducers.map((introducer) => {
              return (
                <Picker.Item
                  key={introducer.id}
                  label={introducer.fullName}
                  value={introducer.id}
                />
              );
            })}
          </Picker>
        </View>

        <Text style={styles.label}>Ng??y ???????c nh???n nu??i: </Text>
        <DateTimePicker
          value={ad}
          mode="date"
          display="calendar"
          onChange={(e, selectedDate) => {
            setAd(selectedDate);
            setAdoptiveDate(convertDateToString(selectedDate));
          }}
        />

        <Text style={styles.label}>Ng?????i nh???n nu??i: </Text>
        <View>
          <Picker
            selectedValue={nurturerId}
            onValueChange={(itemValue, itemIndex) => {
              setNurturerId(itemValue);
              if (itemValue !== 0) setStatus("RECEIVED");
              else setStatus("WAIT_TO_RECEIVE");
            }}
            itemStyle={{ height: 120 }}
          >
            {nurturers.map((nurturer) => {
              return (
                <Picker.Item
                  key={nurturer.id}
                  label={nurturer.fullName}
                  value={nurturer.id}
                />
              );
            })}
          </Picker>
        </View>
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

export default ChildrenUpdateScreen;
