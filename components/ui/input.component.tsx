// components/ui/Input.tsx
import { TextInput, View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";

type InputProps = {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  secureTextEntry?: boolean;
} & Omit<React.ComponentProps<typeof TextInput>, "secureTextEntry">;

export const Input = ({
  label,
  error,
  icon,
  secureTextEntry = false,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : null,
            icon ? { paddingLeft: 48 } : null,
            secureTextEntry ? { paddingRight: 48 } : null,
          ]}
          placeholderTextColor={Colors.white_50}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        {secureTextEntry && (
          <Pressable
            style={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={Colors.white_40} />
            ) : (
              <Eye size={20} color={Colors.white_40} />
            )}
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: Colors.white_70,
    fontFamily: "Inter_Regular",
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.white_40,
    height: 56,
    backgroundColor: Colors.white_00,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: Colors.white_90,
    fontSize: 16,
    fontFamily: "Inter_Regular",
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.red_40,
  },
  errorText: {
    color: Colors.red_40,
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Inter_Regular",
  },
  iconLeft: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
    color: Colors.blue_60,
  },
  iconRight: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
});
