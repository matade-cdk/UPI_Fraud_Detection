import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LandingScreen from "../screens/landing/LandingScreen";
import AuthScreen from "../screens/auth/AuthScreen";
import DashboardTabs from "./DashboardTabs";
import PaymentScreen from "../screens/upi/PaymentScreen";
import PaymentAmountScreen from "../screens/upi/PaymentAmountScreen";
import PaymentDecisionScreen from "../screens/upi/PaymentDecisionScreen";
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ title: "Authentication", headerShadowVisible: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentAmount"
        component={PaymentAmountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentDecision"
        component={PaymentDecisionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
