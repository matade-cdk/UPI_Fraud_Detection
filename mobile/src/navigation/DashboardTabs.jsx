import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import HomeScreen from "../screens/upi/HomeScreen";
import InsightsScreen from "../screens/upi/InsightsScreen";
import CardsScreen from "../screens/upi/CardsScreen";
import ProfileScreen from "../screens/upi/ProfileScreen";
import ScanQrScreen from "../screens/upi/ScanQrScreen";
import { appColors } from "../constants/theme";

const Tab = createBottomTabNavigator();

const tabConfig = {
  HomeTab: { component: HomeScreen, icon: "home-outline", labelKey: "tabs.home" },
  InsightsTab: { component: InsightsScreen, icon: "chart-line", labelKey: "tabs.insights" },
  TransactionsTab: { component: CardsScreen, icon: "history", labelKey: "tabs.transactions" },
  ProfileTab: { component: ProfileScreen, icon: "account-outline", labelKey: "tabs.profile" },
};

function ScanTabButton({ onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.scanBtnWrap}>
      <View style={styles.scanBtn}>
        <MaterialCommunityIcons name="qrcode-scan" size={26} color="#03280f" />
      </View>
    </Pressable>
  );
}

function TabsOnly() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const conf = tabConfig[route.name];
          return <MaterialCommunityIcons name={conf?.icon || "circle"} size={size} color={color} />;
        },
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: "rgba(231,255,233,0.55)",
        tabBarStyle: {
          height: 72,
          backgroundColor: "#07130f",
          borderTopColor: appColors.border,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={tabConfig.HomeTab.component}
        options={{ title: t(tabConfig.HomeTab.labelKey), tabBarLabel: t(tabConfig.HomeTab.labelKey) }}
      />
      <Tab.Screen
        name="InsightsTab"
        component={tabConfig.InsightsTab.component}
        options={{ title: t(tabConfig.InsightsTab.labelKey), tabBarLabel: t(tabConfig.InsightsTab.labelKey) }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanQrScreen}
        options={{
          tabBarLabel: "",
          title: t("tabs.scan"),
          tabBarIcon: () => null,
          tabBarButton: (props) => <ScanTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={tabConfig.TransactionsTab.component}
        options={{
          title: t(tabConfig.TransactionsTab.labelKey),
          tabBarLabel: t("tabs.transactionsShort"),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={tabConfig.ProfileTab.component}
        options={{ title: t(tabConfig.ProfileTab.labelKey), tabBarLabel: t(tabConfig.ProfileTab.labelKey) }}
      />
    </Tab.Navigator>
  );
}

export default function DashboardTabs() {
  return <TabsOnly />;
}

const styles = StyleSheet.create({
  scanBtnWrap: {
    top: -18,
    justifyContent: "center",
    alignItems: "center",
  },
  scanBtn: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: appColors.primary,
    borderWidth: 4,
    borderColor: "#07130f",
    alignItems: "center",
    justifyContent: "center",
  },
});
