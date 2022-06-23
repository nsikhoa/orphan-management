import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart, BarChart } from "react-native-chart-kit";

const BarChartFinance = ({ picnic, furniture, charity, name }) => {
  return (
    <>
      <BarChart
        data={{
          labels: ["Từ thiện", "Dã ngoại", "Trang thiết bị"],
          datasets: [
            {
              data: [charity / 100, picnic / 100, furniture / 100],
            },
          ],
        }}
        width={Dimensions.get("window").width - 16}
        height={220}
        yAxisLabel={""}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 12,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginLeft: 10,
        }}
      />
      <Text style={styles.header}>
        {name} ({"số tiền x 100"})
      </Text>
    </>
  );
};

const PieChartFinance = ({ picnic, furniture, name }) => {
  return (
    <>
      <PieChart
        data={[
          {
            name: "Picnic",
            count: picnic,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: "Thiết bị",
            count: furniture,
            color: "#F00",
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
      <Text style={styles.header}>{name}</Text>
    </>
  );
};

const FinanceStatistic = function () {
  const [charityStat, setCharityStat] = useState([]);
  const [picnicStat, setPicnicStat] = useState([]);
  const [furnitureStat, setFurnitureStat] = useState([]);

  const getFundCharity = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/fund/charity`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setCharityStat(result.data);
      return () => {
        isMounted = false;
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  const getFundPicnic = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/fund/picnic`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setPicnicStat(result.data);
      return () => {
        isMounted = false;
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  const getFundFurniture = async function () {
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
        `https://orphanmanagement.herokuapp.com/api/v1/manager/fund/furniture`,
        requestOptions
      );
      const result = await response.json();
      if (isMounted) setFurnitureStat(result.data);
      return () => {
        isMounted = false;
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(getFundCharity, []);
  useEffect(getFundFurniture, []);
  useEffect(getFundPicnic, []);

  const sumFinance = function (data) {
    let sum = 0;
    data.forEach((el) => {
      sum += el.amount;
    });
    return sum;
  };

  return (
    <ScrollView>
      <PieChartFinance
        picnic={sumFinance(picnicStat)}
        furniture={sumFinance(furnitureStat)}
        name="Biểu đồ tỉ lệ số tiền chi tiêu trong năm 2022"
      />

      <BarChartFinance
        picnic={sumFinance(picnicStat)}
        furniture={sumFinance(furnitureStat)}
        charity={sumFinance(charityStat)}
        name="Biểu đồ tổng tiền các khoản thu chi trong năm 2022"
      />
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

export default FinanceStatistic;
