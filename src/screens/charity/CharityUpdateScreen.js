import React, { useState } from "react";
import { Text, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CharityUpdateScreen = function ({ navigation }) {
  const charity = navigation.state.params;

  const [charityName, setCharityName] = useState(charity.charityName);
  const [dateStart, setDateStart] = useState(charity.dateStart);
  const [dateEnd, setDateEnd] = useState(charity.dateEnd);
  const [title, setTitle] = useState(charity.title);
  const [content, setContent] = useState(charity.content);
  const [totalDonation, setTotalDonation] = useState(0);

  const updateCharity = async function () {
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
      totalDonation,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/manager/charity/${charity.id}`,
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
      } else if (result.code == 500 || result.code == 405) {
        Alert.alert("Thông báo", "Cập nhật không thành công");
      } else
        Alert.alert("Thông báo", "Cập nhật thành công", [
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

        <Text style={styles.label}>Tổng đóng góp: </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Tổng đóng góp"
          value={totalDonation.toString()}
          onChangeText={(totalDonation) => setTotalDonation(totalDonation)}
          autoCapitalize="none"
        />
      </ScrollView>
      <Button
        title="Cập Nhật Hoạt Động Từ Thiện"
        onPress={() => {
          updateCharity();
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

export default CharityUpdateScreen;
