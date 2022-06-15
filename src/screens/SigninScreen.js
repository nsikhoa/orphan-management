import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import { Text, Input, Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const image = {
  uri: "https://s3-alpha-sig.figma.com/img/d2aa/e34c/32bf098316c8b1bfdb4dcce09baed58a?Expires=1649635200&Signature=F~HALAVVX8CQzapfj-nboaaZA-YzSs5iSOowegVWyiwGLwKDa1hwtcBItv8k2ickML1TfCrEm0PvvAwO4leVcGS0XlkxjfunEBnTk8pXSmjT2ZpMfsrPK7YjOI8DjZ63yXBd6FRraSKD8Q87x3AG~O2hXNib8a4O2W2AyG6ks12QMXR-~ZSp8C7Or8Bss7T5APqgqYbbp3n57cfRywlruCWZzi7Bxuu8dU9O67~Ff2jL3Nm4LhMXhORz-dzqmOxGT7uJTPBkQGSmXmLojsu-pIv3yUXxoMKhQlXxvleFMtYViQSwRXwlgKj6wNbcJ4v-uPfVhnK1Fdh4uVvn30BjQQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
};

const SigninScreen = function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let check = false;

  const login = async function () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email,
      password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "https://orphanmanagement.herokuapp.com/api/v1/auth/login",
        requestOptions
      );
      const result = await response.json();
      if (result.code == 200) {
        check = true;
        await AsyncStorage.setItem("accessToken", result.data.token);
        navigation.navigate("drawer");
      } else if (result.status == 500) {
        Alert.alert("Thông báo", "Lỗi hệ thống!");
      } else {
        Alert.alert("Thông báo", "Sai mật khẩu hoặc tên đăng nhập!");
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.image}
        imageStyle={{ opacity: 0.4 }}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,1)",
            margin: 10,
            borderRadius: 10,
            marginBottom: 150,
          }}
        >
          <View
            style={{
              backgroundColor: "#C6D9EE",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
          >
            <Spacer>
              <Text
                h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#0F1E54",
                }}
              >
                Đăng nhập
              </Text>
            </Spacer>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 15,
              marginTop: 15,
              fontSize: 12,
              color: "#0F1E54",
            }}
          >
            Chào mừng bạn đến với Trung tâm bảo trợ trẻ em CYF
          </Text>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Spacer />
          <Input
            secureTextEntry
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Spacer>
            <Button
              title="Đăng nhập"
              buttonStyle={{ backgroundColor: "#0F1E70", borderRadius: 10 }}
              onPress={login}
            />
          </Spacer>
        </View>
      </ImageBackground>
    </View>
  );
};

SigninScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ECF5FF",
    // marginBottom: 100,
    // padding: 10,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});

export default SigninScreen;
