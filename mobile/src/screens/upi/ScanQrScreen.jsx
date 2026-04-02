import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";

function parseUpiData(value) {
  if (!value || !value.startsWith("upi://pay")) {
    return null;
  }

  const query = value.split("?")[1] || "";
  const params = new URLSearchParams(query);
  const upiRecipient = params.get("pa") || "unknown@upi";
  const name = params.get("pn") || upiRecipient.split("@")[0] || "Scanned User";
  const amount = Number(params.get("am") || 0);

  return {
    name,
    vpa: upiRecipient,
    amount: Number.isFinite(amount) && amount > 0 ? amount : 0,
    bank: "UPI Linked Bank",
    trustScore: 52,
    transactionType: "TRANSFER",
  };
}

export default function ScanQrScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);

  const onBarCodeScanned = ({ data }) => {
    if (scanned) {
      return;
    }

    const parsed = parseUpiData(data);
    if (!parsed) {
      Alert.alert("Unsupported QR", "This QR is not a valid UPI payment QR.");
      setScanned(true);
      return;
    }

    setScanned(true);
    navigation.navigate("Payment", { recipient: parsed, actionType: "Scan Pay" });
  };

  if (!permission) {
    return (
      <ScreenContainer>
        <View style={styles.box}>
          <Text style={styles.desc}>Loading camera permissions...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <View style={styles.box}>
          <MaterialCommunityIcons name="camera-off-outline" size={46} color={appColors.warning} />
          <Text style={styles.title}>Camera Access Needed</Text>
          <Text style={styles.desc}>Allow camera permission to scan UPI QR codes for payments.</Text>
          <Pressable style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Allow Camera</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.box}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={onBarCodeScanned}
        />
        <View style={styles.overlayTarget} />
        <Text style={styles.title}>Scan UPI QR</Text>
        <Text style={styles.desc}>Point your camera at a UPI QR code to start secure payment.</Text>
        <Pressable style={styles.btn} onPress={() => setScanned(false)}>
          <Text style={styles.btnText}>{scanned ? "Scan Again" : "Scanner Active"}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  camera: {
    height: 280,
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  overlayTarget: {
    position: "absolute",
    top: 84,
    height: 170,
    width: 170,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 14,
  },
  title: {
    color: appColors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  desc: {
    color: appColors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  btn: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: appColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnText: {
    color: "#03280f",
    fontWeight: "800",
  },
});
