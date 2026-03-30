import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/upi/HomeScreen";
import InsightsScreen from "../screens/upi/InsightsScreen";
import CardsScreen from "../screens/upi/CardsScreen";
import ProfileScreen from "../screens/upi/ProfileScreen";
import ScanQrScreen from "../screens/upi/ScanQrScreen";
import { appColors } from "../constants/theme";

const Tab = createBottomTabNavigator();

const tabs = [
  { name: "Home", component: HomeScreen, icon: "home-outline" },
  { name: "Insights", component: InsightsScreen, icon: "chart-line" },
  { name: "Previous Transactions", component: CardsScreen, icon: "history" },
  { name: "Profile", component: ProfileScreen, icon: "account-outline" },
];

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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const conf = tabs.find((t) => t.name === route.name);
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
      <Tab.Screen name={tabs[0].name} component={tabs[0].component} />
      <Tab.Screen name={tabs[1].name} component={tabs[1].component} />
      <Tab.Screen
        name="Scan"
        component={ScanQrScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => <ScanTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name={tabs[2].name}
        component={tabs[2].component}
        options={{ tabBarLabel: "Previous" }}
      />
      <Tab.Screen name={tabs[3].name} component={tabs[3].component} />
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
