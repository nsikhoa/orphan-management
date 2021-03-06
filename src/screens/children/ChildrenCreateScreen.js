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

const ChildrenCreateScreen = function ({ navigation }) {
  const [introducers, setIntroducer] = useState([]);
  const [dob, setDob] = useState(new Date());
  const [ad, setAd] = useState(new Date());
  const [iDate, setIDate] = useState(new Date());
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState(true);
  const [introducerId, setIntroducerId] = useState(0);
  // const [status, setStatus] = useState("WAIT_TO_RECEIVE");
  const [introductoryDate, setIntroductoryDate] = useState(
    convertDateToString(new Date())
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    convertDateToString(new Date())
  );
  const [adoptiveDate, setAdoptiveDate] = useState("");

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

  const createChild = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      dateOfBirth,
      fullName,
      gender,
      adoptiveDate,
      introductoryDate,
      introducerId,
      nurturerId: 0,
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
        "https://orphanmanagement.herokuapp.com/api/v1/manager/children",
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

        <Text style={styles.label}>Gi???i t??nh: </Text>
        <View>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => {
              setGender(itemValue);
            }}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item key={1} label="Nam" value={true} />
            <Picker.Item key={0} label="N???" value={false} />
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

        <Text style={styles.label}>Ng??y ???????c gi???i thi???u: </Text>
        <DateTimePicker
          value={iDate}
          mode="date"
          display="calendar"
          onChange={(e, selectedDate) => {
            setIDate(selectedDate);
            setIntroductoryDate(convertDateToString(selectedDate));
          }}
        />

        {/* <Text style={styles.label}>Ng??y nh???n nu??i: </Text>
        <DateTimePicker
          value={ad}
          mode="date"
          display="calendar"
          onChange={(e, selectedDate) => {
            setAd(selectedDate);
            setAdoptiveDate(convertDateToString(selectedDate));
            console.log(adoptiveDate);
          }}
        /> */}

        {/* <Text style={styles.label}>Tr???ng th??i: </Text>
        <View>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue, itemIndex) => {
              setStatus(itemValue);
            }}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item label="??ang ??? trung t??m" value="WAIT_TO_RECEIVE" />
            <Picker.Item label="???? ???????c nh???n nu??i" value="RECEIVED" />
          </Picker>
        </View> */}
      </ScrollView>
      <Button
        title="Th??m tr??? em"
        onPress={() => {
          createChild();
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

export default ChildrenCreateScreen;
