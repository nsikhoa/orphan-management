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
import AccountDetailScreen from "./src/screens/account/AccountDetailScreen";
import AccountListDeleteScreen from "./src/screens/account/AccountListDeleteScreen";
import AccountUpdateScreen from "./src/screens/account/AccountUpdateScreen";
import PicnicListScreen from "./src/screens/picnic/PicnicListScreen";
import PicnicCreateScreen from "./src/screens/picnic/PicnicCreateScreen";
import PicnicDetailScreen from "./src/screens/picnic/PicnicDetailScreen";
import PicnicUpdateScreen from "./src/screens/picnic/PicnicUpdateScreen";
import ProfileDetailScreen from "./src/screens/profile/ProfileDetailScreen";
import ProfileUpdateScreen from "./src/screens/profile/ProfileUpdateScreen";
import ProfileChangePasswordScreen from "./src/screens/profile/ProfileChangePasswordScreen";
import CharityListScreen from "./src/screens/charity/CharityListScreen";
import CharityDetailScreen from "./src/screens/charity/CharityDetailScreen";
import CharityCreateScreen from "./src/screens/charity/CharityCreateScreen";
import CharityUpdateScreen from "./src/screens/charity/CharityUpdateScreen";
import ChildrenStatistic from "./src/screens/statistic/ChildrenStatistic";
import AccountStatistic from "./src/screens/statistic/AccountStatistic";
import FinanceStatistic from "./src/screens/statistic/FinanceStatistic";
import SideMenu from "./src/components/SideMenu";
import HeaderEl from "./src/components/HeaderEl";
import { Ionicons } from "@expo/vector-icons";

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
    tabBarIcon: <Ionicons name="stats-chart" size={24} color="black" />,
  };
};

const accountStack = createStackNavigator({
  AccountList: {
    screen: AccountListScreen,
    navigationOptions: ({ navigation }) => mainHeader(navigation, "T??i kho???n"),
  },
  AccountDelete: {
    screen: AccountListDeleteScreen,
    navigationOptions: () => header("T??i kho???n l??u tr???"),
  },
  AccountCreate: {
    screen: AccountCreateScreen,
    navigationOptions: () => header("Th??m t??i kho???n"),
  },
  AccountDetail: {
    screen: AccountDetailScreen,
    navigationOptions: () => header("Chi ti???t t??i kho???n"),
  },
  AccountUpdate: {
    screen: AccountUpdateScreen,
    navigationOptions: () => header("C???p nh???t t??i kho???n"),
  },
});

const childrenStack = createStackNavigator({
  ChildrenList: {
    screen: ChildrenListScreen,
    navigationOptions: ({ navigation }) => mainHeader(navigation, "Tr??? em"),
  },
  ChildrenDetail: {
    screen: ChildrenDetailScreen,
    navigationOptions: () => header("Chi ti???t tr??? em"),
  },
  ChildrenCreate: {
    screen: ChildrenCreateScreen,
    navigationOptions: () => header("Th??m tr??? em"),
  },
  ChildrenUpdate: {
    screen: ChildrenUpdateScreen,
    navigationOptions: () => header("C???p nh???t tr??? em"),
  },
});

const staffStack = createStackNavigator({
  StaffList: {
    screen: StaffListScreen,
    navigationOptions: ({ navigation }) => mainHeader(navigation, "Nh??n vi??n"),
  },
  StaffDetail: {
    screen: StaffDetailScreen,
    navigationOptions: () => header("Chi ti???t nh??n vi??n"),
  },
  StaffCreate: {
    screen: StaffCreateScreen,
    navigationOptions: () => header("Th??m nh??n vi??n"),
  },
  StaffUpdate: {
    screen: StaffUpdateScreen,
    navigationOptions: () => header("C???p nh???t nh??n vi??n"),
  },
});

const furnitureStack = createStackNavigator({
  FurnitureList: {
    screen: FurnitureListScreen,
    navigationOptions: ({ navigation }) =>
      mainHeader(navigation, "Trang thi???t b???"),
  },
  FurnitureCreate: {
    screen: FurnitureCreateScreen,
    navigationOptions: () => header("Th??m trang thi???t b???"),
  },
  FurnitureDetail: {
    screen: FurnitureDetailScreen,
    navigationOptions: () => header("Chi ti???t trang thi???t b???"),
  },
  FurnitureUpdate: {
    screen: FurnitureUpdateScreen,
    navigationOptions: () => header("C???p nh???t trang thi???t b???"),
  },
});

const introducerStack = createStackNavigator({
  IntroducerList: {
    screen: IntroducerListScreen,
    navigationOptions: ({ navigation }) =>
      mainHeader(navigation, "Gi???i thi???u tr???"),
  },
  IntroducerCreate: {
    screen: IntroducerCreateScreen,
    navigationOptions: () => header("Th??m ng?????i gi???i thi???u"),
  },
  IntroducerDetail: {
    screen: IntroducerDetailScreen,
    navigationOptions: () => header("Chi ti???t ng?????i gi???i thi???u"),
  },
  IntroducerUpdate: {
    screen: IntroducerUpdateScreen,
    navigationOptions: () => header("C???p nh???t ng?????i gi???i thi???u"),
  },
});

const nurturerStack = createStackNavigator({
  NurturerList: {
    screen: NurturerListScreen,
    navigationOptions: ({ navigation }) =>
      mainHeader(navigation, "Nh???n nu??i tr???"),
  },
  NurturerCreate: {
    screen: NurturerCreateScreen,
    navigationOptions: () => header("Th??m ng?????i nh???n nu??i"),
  },
  NurturerDetail: {
    screen: NurturerDetailScreen,
    navigationOptions: () => header("Chi ti???t ng?????i nh???n nu??i"),
  },
  NurturerUpdate: {
    screen: NurturerUpdateScreen,
    navigationOptions: () => header("C???p nh???t ng?????i nh???n nu??i"),
  },
});

const picnicStack = createStackNavigator({
  PicnicList: {
    screen: PicnicListScreen,
    navigationOptions: ({ navigation }) => mainHeader(navigation, "D?? ngo???i"),
  },
  PicnicCreate: {
    screen: PicnicCreateScreen,
    navigationOptions: () => header("Th??m th??ng tin d?? ngo???i"),
  },
  PicnicDetail: {
    screen: PicnicDetailScreen,
    navigationOptions: () => header("Chi ti???t s??? ki???n d?? ngo???i"),
  },
  PicnicUpdate: {
    screen: PicnicUpdateScreen,
    navigationOptions: () => header("C???p nh???t th??ng tin d?? ngo???i"),
  },
});

const charityStack = createStackNavigator({
  CharityList: {
    screen: CharityListScreen,
    navigationOptions: ({ navigation }) => mainHeader(navigation, "T??? thi???n"),
  },
  CharityCreate: {
    screen: CharityCreateScreen,
    navigationOptions: () => header("Th??m s??? ki???n t??? thi???n"),
  },
  CharityDetail: {
    screen: CharityDetailScreen,
    navigationOptions: () => header("Chi ti???t s??? ki???n t??? thi???n"),
  },
  CharityUpdate: {
    screen: CharityUpdateScreen,
    navigationOptions: () => header("C???p nh???t s??? ki???n t??? thi???n"),
  },
});

const profileStack = createStackNavigator({
  ProfileDetail: {
    screen: ProfileDetailScreen,
    navigationOptions: ({ navigation }) =>
      mainHeader(navigation, "T??i kho???n c?? nh??n"),
  },
  ProfileUpdate: {
    screen: ProfileUpdateScreen,
    navigationOptions: () => header("Chi ti???t t??i kho???n c?? nh??n"),
  },
  ProfileChangePassword: {
    screen: ProfileChangePasswordScreen,
    navigationOptions: () => header("?????i m???t kh???u"),
  },
});

const statBottom = createBottomTabNavigator({
  ChildrenStat: {
    screen: ChildrenStatistic,
    navigationOptions: () => header("Th???ng k?? tr??? em"),
  },
  AccountStat: {
    screen: AccountStatistic,
    navigationOptions: () => header("Th???ng k?? t??i kho???n ng?????i d??ng"),
  },
  FinanceStat: {
    screen: FinanceStatistic,
    navigationOptions: () => header("Th???ng k?? t??i ch??nh"),
  },
});

const appDrawer = createDrawerNavigator(
  {
    profile: profileStack,
    account: accountStack,
    staffs: staffStack,
    children: childrenStack,
    furniture: furnitureStack,
    introducer: introducerStack,
    nurturer: nurturerStack,
    picnic: picnicStack,
    stat: statBottom,
    charity: charityStack,
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
