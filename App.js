import React from "react";
import { Dimensions, Text, StyleSheet } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";
import SigninScreen from "./src/screens/SigninScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import AccountScreen from "./src/screens/AccountScreen";
import ChildrenListScreen from "./src/screens/children/ChildrenListScreen";
import ChildrenDetailScreen from "./src/screens/children/ChildrenDetailScreen";
import ChildrenCreateScreen from "./src/screens/children/ChildrenCreateScreen";
import ChildrenUpdateScreen from "./src/screens/children/ChildrenUpdateScreen";
import StaffListScreen from "./src/screens/staffs/StaffListScreen";
import StaffDetailScreen from "./src/screens/staffs/StaffDetailScreen";
import StaffCreateScreen from "./src/screens/staffs/StaffCreateScreen";
import StaffUpdateScreen from "./src/screens/staffs/StaffUpdateScreen";
import FurnitureListScreen from "./src/screens/furniture/FurnitureListScreen";
import FurnitureCreateScreen from "./src/screens/furniture/FurnitureCreateScreen";
import FurnitureDetailScreen from "./src/screens/furniture/FurnitureDetailScreen";
import FurnitureUpdateScreen from "./src/screens/furniture/FurnitureUpdateScreen";
import IntroducerListScreen from "./src/screens/introducer/IntroducerListScreen";
import IntroducerDetailScreen from "./src/screens/introducer/IntroducerDetailScreen";
import IntroducerCreateScreen from "./src/screens/introducer/IntroducerCreateScreen";
import IntroducerUpdateScreen from "./src/screens/introducer/IntroducerUpdateScreen";
import NurturerListScreen from "./src/screens/nurturer/NurturerListScreen";
import NurturerDetailScreen from "./src/screens/nurturer/NurturerDetailScreen";
import NurturerCreateScreen from "./src/screens/nurturer/NurturerCreateScreen";
import NurturerUpdateScreen from "./src/screens/nurturer/NurturerUpdateScreen";
import AccountListScreen from "./src/screens/account/AccountListScreen";
import AccountCreateScreen from "./src/screens/account/AccountCreateScreen";
import SideMenu from "./src/components/SideMenu";
import HeaderEl from "./src/components/HeaderEl";

const loginStack = createStackNavigator(
  {
    Signin: SigninScreen,
    ForgotPassword: ForgotPasswordScreen,
    Account: AccountScreen,
  },
  {
    defaultNavigationOptions: {
      title: "CYF Center",
    },
  }
);

const mainHeader = function (navigation, title) {
  return {
    title,
    headerLeft: () => <HeaderEl navigation={navigation} />,
    headerRight: () => <Text style={styles.text}>CYF</Text>,
    headerStyle: {
      backgroundColor: "#0F1E80",
    },
    headerTitleStyle: {
      color: "#fff",
    },
  };
};

const header = function (title) {
  return {
    title,
    headerRight: () => <Text style={styles.text}>CYF</Text>,
    headerStyle: {
      backgroundColor: "#0F1E80",
    },
    headerTitleStyle: {
      color: "#fff",
    },
  };
};

const accountStack = createStackNavigator({
  AccountList: {
    screen: AccountListScreen,
    navigationOptions: ({ navigation }) => mainHeader(navigation, "Tài khoản"),
  },
  AccountCreate: {
    screen: AccountCreateScreen,
    navigationOptions: () => header("Thêm tài khoản"),
  },
});

const childrenStack = createStackNavigator({
  ChildrenList: {
    screen: ChildrenListScreen,
    navigationOptions: ({ navigation }) => mainHeader(navigation, "Trẻ em"),
  },
  ChildrenDetail: {
    screen: ChildrenDetailScreen,
    navigationOptions: () => header("Chi tiết trẻ em"),
  },
  ChildrenCreate: {
    screen: ChildrenCreateScreen,
    navigationOptions: () => header("Thêm trẻ em"),
  },
  ChildrenUpdate: {
    screen: ChildrenUpdateScreen,
    navigationOptions: () => header("Cập nhật trẻ em"),
  },
});

const staffStack = createStackNavigator({
  StaffList: {
    screen: StaffListScreen,
    navigationOptions: ({ navigation }) => mainHeader(navigation, "Nhân viên"),
  },
  StaffDetail: {
    screen: StaffDetailScreen,
    navigationOptions: () => header("Chi tiết nhân viên"),
  },
  StaffCreate: {
    screen: StaffCreateScreen,
    navigationOptions: () => header("Thêm nhân viên"),
  },
  StaffUpdate: {
    screen: StaffUpdateScreen,
    navigationOptions: () => header("Cập nhật nhân viên"),
  },
});

const furnitureStack = createStackNavigator({
  FurnitureList: {
    screen: FurnitureListScreen,
    navigationOptions: ({ navigation }) =>
      mainHeader(navigation, "Trang thiết bị"),
  },
  FurnitureCreate: {
    screen: FurnitureCreateScreen,
    navigationOptions: () => header("Thêm trang thiết bị"),
  },
  FurnitureDetail: {
    screen: FurnitureDetailScreen,
    navigationOptions: () => header("Chi tiết trang thiết bị"),
  },
  FurnitureUpdate: {
    screen: FurnitureUpdateScreen,
    navigationOptions: () => header("Cập nhật trang thiết bị"),
  },
});

const introducerStack = createStackNavigator({
  IntroducerList: {
    screen: IntroducerListScreen,
    navigationOptions: ({ navigation }) =>
      mainHeader(navigation, "Giới thiệu trẻ"),
  },
  IntroducerCreate: {
    screen: IntroducerCreateScreen,
    navigationOptions: () => header("Thêm người giới thiệu"),
  },
  IntroducerDetail: {
    screen: IntroducerDetailScreen,
    navigationOptions: () => header("Chi tiết người giới thiệu"),
  },
  IntroducerUpdate: {
    screen: IntroducerUpdateScreen,
    navigationOptions: () => header("Cập nhật người giới thiệu"),
  },
});

const nurturerStack = createStackNavigator({
  NurturerList: {
    screen: NurturerListScreen,
    navigationOptions: ({ navigation }) =>
      mainHeader(navigation, "Nhận nuôi trẻ"),
  },
  NurturerCreate: {
    screen: NurturerCreateScreen,
    navigationOptions: () => header("Thêm người nhận nuôi"),
  },
  NurturerDetail: {
    screen: NurturerDetailScreen,
    navigationOptions: () => header("Chi tiết người nhận nuôi"),
  },
  NurturerUpdate: {
    screen: NurturerUpdateScreen,
    navigationOptions: () => header("Cập nhật người nhận nuôi"),
  },
});

const appDrawer = createDrawerNavigator(
  {
    account: accountStack,
    staffs: staffStack,
    children: childrenStack,
    furniture: furnitureStack,
    introducer: introducerStack,
    nurturer: nurturerStack,
  },
  {
    contentComponent: SideMenu,
    drawerWidth: (Dimensions.get("window").width * 3) / 4,
  }
);

const app = createSwitchNavigator(
  {
    drawer: appDrawer,
    auth: loginStack,
  },
  {
    initialRouteName: "auth",
    defaultNavigationOptions: {
      title: "CYF Center",
    },
  }
);

const styles = StyleSheet.create({
  text: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 20,
    marginRight: 10,
    color: "#00B3FF",
  },
});

export default createAppContainer(app);

// const switchNavigator = createSwitchNavigator({
//   loginFlow: loginStack,
//   mainFlow: createBottomTabNavigator({
//     childrenFlow: childrenStack,
//   }),
// });

// const childrenStack = createStackNavigator({
//   ChildrenList: ChildrenListScreen,
//   ChildrenDetail: ChildrenDetailScreen,
//   ChildrenCreate: ChildrenCreateScreen,
//   ChildrenUpdate: ChildrenUpdateScreen,
// });

// const MainStack = createStackNavigator({
//   Account: AccountScreen,
//   Children: {
//     screen: childrenStack,
//   },
// });

// const appDrawer = createDrawerNavigator(
//   {
//     drawer: MainStack,
//   },
//   {
//     contentComponent: SideMenu,
//     drawerWidth: (Dimensions.get("window").width * 3) / 4,
//   }
// );
