import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const PicnicUpdateScreen = function ({ navigation }) {
  const picnic = navigation.state.params;

  const [namePicnic, setNamePicnic] = useState(picnic.namePicnic);
  const [dateStart, setDateStart] = useState(picnic.dateStart);
  const [dateEnd, setDateEnd] = useState(picnic.dateEnd);
  const [title, setTitle] = useState(picnic.title);
  const [content, setContent] = useState(picnic.content);
  const [address, setAddress] = useState(picnic.address);
  const [money, setMoney] = useState(picnic.money);
  const [isCompleted, setIsCompleted] = useState(picnic.isCompleted);

  const update = async function () {
    const id = await AsyncStorage.getItem("picnicId");
    const token = await AsyncStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      namePicnic,
      dateStart,
      dateEnd,
      title,
      content,
      money,
      address,
      personInChargeId: [0],
      isCompleted,
      image: picnic.image,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/manager/picnic/${id}`,
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

  return (
    <KeyboardAwareScrollView extraHeight={150}>
      <ScrollView>
        <Text style={styles.label}>Tên sự kiện: </Text>
        <TextInput
          style={styles.input}
          placeholder="Tên sự kiện"
          value={namePicnic}
          onChangeText={(namePicnic) => setNamePicnic(namePicnic)}
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

        <Text style={styles.label}>Địa điểm: </Text>
        <TextInput
          style={styles.input}
          placeholder="Địa điểm"
          value={address}
          onChangeText={(address) => setAddress(address)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Chi phí: </Text>
        <TextInput
          style={styles.input}
          placeholder="Chi phí"
          value={money.toString()}
          onChangeText={(money) => setMoney(Number(money))}
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
        <Text style={styles.label}>Sự kiện: </Text>
        <View>
          <Picker
            selectedValue={isCompleted}
            onValueChange={(itemValue, itemIndex) => {
              setIsCompleted(itemValue);
            }}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item key={1} label="Chưa diễn ra" value={true} />
            <Picker.Item key={0} label="Đã diễn ra" value={false} />
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

export default PicnicUpdateScreen;
