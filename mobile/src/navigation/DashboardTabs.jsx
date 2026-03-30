import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import OverviewScreen from "../screens/dashboard/OverviewScreen";
import AnalyticsScreen from "../screens/dashboard/AnalyticsScreen";
import TransactionsScreen from "../screens/dashboard/TransactionsScreen";
import AlertsScreen from "../screens/dashboard/AlertsScreen";
import MLModelScreen from "../screens/dashboard/MLModelScreen";
import SettingsScreen from "../screens/dashboard/SettingsScreen";
import AssistantSheet from "../components/AssistantSheet";
import { appColors } from "../constants/theme";

const Tab = createBottomTabNavigator();

const tabs = [
  { name: "Overview", component: OverviewScreen, icon: "view-dashboard-outline" },
  { name: "Analytics", component: AnalyticsScreen, icon: "chart-line" },
  { name: "Transactions", component: TransactionsScreen, icon: "swap-horizontal" },
  { name: "Alerts", component: AlertsScreen, icon: "alert-outline" },
  { name: "ML Model", component: MLModelScreen, icon: "brain" },
  { name: "Settings", component: SettingsScreen, icon: "cog-outline" },
];

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
          height: 66,
          backgroundColor: "#07130f",
          borderTopColor: appColors.border,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      })}
    >
      {tabs.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}

export default function DashboardTabs() {
  return (
    <>
      <TabsOnly />
      <AssistantSheet />
    </>
  );
}
