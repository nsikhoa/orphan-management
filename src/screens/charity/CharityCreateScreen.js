import React, { useState } from "react";
import { Text, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CharityCreateScreen = function ({ navigation }) {
  const [charityName, setCharityName] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createCharity = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      charityName,
      dateStart,
      dateEnd,
      title,
      content,
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
        "https://orphanmanagement.herokuapp.com/api/v1/manager/charity",
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
      } else if (result.code == 500) {
        Alert.alert("Thông báo", "Thêm không thành công");
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
        <Text style={styles.label}>Tên sự kiện: </Text>
        <TextInput
          style={styles.input}
          placeholder="Tên sự kiện"
          value={charityName}
          onChangeText={(charityName) => setCharityName(charityName)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Chủ đề: </Text>
        <TextInput
          style={styles.input}
          placeholder="Chủ đề"
          value={title}
          onChangeText={(title) => setTitle(title)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Thời gian bắt đầu: </Text>
        <TextInput
          style={styles.input}
          placeholder="dd/MM/yyyy hh:mm"
          value={dateStart}
          onChangeText={(dateStart) => setDateStart(dateStart)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Thời gian kết thúc: </Text>
        <TextInput
          style={styles.input}
          placeholder="dd/MM/yyyy hh:mm"
          value={dateEnd}
          onChangeText={(dateEnd) => setDateEnd(dateEnd)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Nội dung sự kiện: </Text>
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={10}
          placeholder="Nội dung sự kiện"
          value={content}
          onChangeText={(content) => setContent(content)}
          autoCapitalize="none"
        />
      </ScrollView>
      <Button
        title="Thêm Hoạt Động Từ Thiện"
        onPress={() => {
          createCharity();
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

export default CharityCreateScreen;
