import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LandingScreen from "../screens/landing/LandingScreen";
import DashboardTabs from "./DashboardTabs";
import { appColors } from "../constants/theme";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerStyle: { backgroundColor: "#07130f" },
        headerTintColor: appColors.text,
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: appColors.bg },
      }}
    >
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ title: "UPIGuard", headerShadowVisible: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
