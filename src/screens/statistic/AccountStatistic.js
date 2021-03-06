import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart, BarChart } from "react-native-chart-kit";

const BarChartUser = ({ data, name }) => {
  let years = [];
  let amount = [];
  data.forEach((el) => {
    years.push(el.year);
    amount.push(el.amount);
  });
  years = years.slice(-7);
  amount = amount.slice(-7);
  return (
    <>
      <BarChart
        data={{
          labels: years,
          datasets: [
            {
              data: amount,
            },
          ],
        }}
        width={Dimensions.get("window").width - 20}
        height={220}
        yAxisLabel={""}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 12,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <Text style={styles.header}>{name}</Text>
    </>
  );
};

const PieChartGender = ({ data }) => {
  let amount = [];
  data.forEach((el) => {
    amount.push(el.value);
  });
  return (
    <>
      <PieChart
        data={[
          {
            name: "Quản trị viên",
            count: amount[0],
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: "Nhân viên",
            count: amount[1],
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: "Quản lý trẻ em",
            count: amount[2],
            color: "#FFFF00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: "Quản lý nhân\nviên",
            count: amount[3],
            color: "#800080",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: "Quản lý hậu cần",
            count: amount[4],
            color: "#800000",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
        ]}
        width={Dimensions.get("window").width}
        height={220}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute //for the absolute number remove if you want percentage
      />
      <Text style={styles.header}>Thống kê quyền hệ thống</Text>
    </>
  );
};

const AccountStatistic = function () {
  const [roleStat, setRoleStat] = useState([]);
  const [userOnBoardStat, setUserOnBoardStat] = useState([]);

  const getStatsRole = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    let isMounted = true;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/admin/user/role`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setRoleStat(result.data);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      throw new Error(err);
    }
  };

  const getStatsUserOnBoard = async function () {
    const token = await AsyncStorage.getItem("accessToken");
    let isMounted = true;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://orphanmanagement.herokuapp.com/api/v1/admin/user/onboard/year`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setUserOnBoardStat(result.data);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(getStatsRole, []);
  useEffect(getStatsUserOnBoard, []);

  return (
    <ScrollView>
      {roleStat ? <PieChartGender data={roleStat} /> : <></>}
      {userOnBoardStat ? (
        <BarChartUser
          data={userOnBoardStat}
          name="Thống kê tài khoản đã tạo (vẫn còn hoạt động) trong các năm"
        />
      ) : (
        <></>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    padding: 16,
    marginTop: 8,
    marginBottom: 50,
  },
});

export default AccountStatistic;
