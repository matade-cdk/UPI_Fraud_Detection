import { Platform } from "react-native";
import Constants from "expo-constants";

const ENV_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || "").trim();

function getExpoHostIp() {
	const hostUri =
		Constants.expoConfig?.hostUri ||
		Constants.manifest2?.extra?.expoClient?.hostUri ||
		"";

	if (!hostUri) {
		return "";
	}

	return hostUri.split(":")[0];
}

function getDefaultBaseUrl() {
	const expoHostIp = getExpoHostIp();

	if (Platform.OS === "android") {
		// On Android emulator use 10.0.2.2, on real device use Expo host IP.
		return expoHostIp ? `http://${expoHostIp}:5000` : "http://10.0.2.2:5000";
	}

	// iOS simulator can use localhost, real device should use Expo host IP.
	return expoHostIp ? `http://${expoHostIp}:5000` : "http://localhost:5000";
}

export const API_BASE_URL = ENV_BASE_URL || getDefaultBaseUrl();
