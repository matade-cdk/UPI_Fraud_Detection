import React from "react";
import { View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RootNavigator from "./src/navigation/RootNavigator";
import { appColors } from "./src/constants/theme";
import { AuthProvider } from "./src/context/AuthContext";
import { TransactionsProvider } from "./src/context/TransactionsContext";
import "./src/i18n";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: appColors.bg,
    card: appColors.panel,
    text: appColors.text,
    border: appColors.border,
    primary: appColors.primary,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TransactionsProvider>
          <View style={{ flex: 1 }}>
            <NavigationContainer theme={navTheme}>
              <StatusBar style="light" />
              <RootNavigator />
            </NavigationContainer>
          </View>
        </TransactionsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
