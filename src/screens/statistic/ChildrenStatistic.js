import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart, BarChart } from "react-native-chart-kit";

const BarChartIntroducer = ({ data, name }) => {
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
            name: "Nam",
            count: amount[1],
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: "Nữ",
            count: amount[0],
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
        ]}
        width={Dimensions.get("window").width - 16}
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
        paddingLeft="15"
        absolute //for the absolute number remove if you want percentage
      />
      <Text style={styles.header}>Thống kê giới tính trẻ</Text>
    </>
  );
};

const ChildrenStatistic = function () {
  const [statsGender, setStatsGender] = useState([]);
  const [statsIntroducer, setStatsIntroducer] = useState([]);
  const [statsNurturer, setStatsNurturer] = useState([]);

  const getStatsGender = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/admin/children/gender`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setStatsGender(result.data);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      throw new Error(err);
    }
  };

  const getStatsIntroducer = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/admin/children/introducer/year`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setStatsIntroducer(result.data);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      throw new Error(err);
    }
  };

  const getStatsNurturer = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/admin/children/nurturer/year`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setStatsNurturer(result.data);
      return () => {
        isMounted = false;
      };
      // console.log(children);
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(() => {
    getStatsGender();
  }, []);

  useEffect(() => {
    getStatsIntroducer();
  }, []);

  useEffect(() => {
    getStatsNurturer();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          {statsGender ? <PieChartGender data={statsGender} /> : <></>}
          {statsIntroducer ? (
            <BarChartIntroducer
              data={statsIntroducer}
              name="Thống kê trẻ em được giới thiệu theo năm"
            />
          ) : (
            <></>
          )}
          {statsNurturer ? (
            <BarChartIntroducer
              data={statsNurturer}
              name="Thống kê trẻ em được nhận nuôi theo năm"
            />
          ) : (
            <></>
          )}
        </View>
      </View>
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

export default ChildrenStatistic;
