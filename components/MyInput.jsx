import React, { useState } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import COLORS from "../utils/colors";

const MyInput = ({
  placeholder,
  type,
  error,
  onFocus = () => {},
  style,
  ...props
}) => {
  const [passwordHidden, setPasswordHidden] = useState(false);
  return (
    <>
      <View
        style={{
          ...style,
          ...styles.container,
          borderWidth: error ? 1 : 0,
          borderColor: error ? COLORS.error : null,
        }}
      >
        <TextInput
          secureTextEntry={
            type === "password" && !passwordHidden ? true : false
          }
          autoCorrect={false}
          onFocus={() => {
            onFocus();
          }}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="gray"
          {...props}
        />
        {type === "password" && (
          <TouchableOpacity
            onPress={() => setPasswordHidden(!passwordHidden)}
            style={styles.eye}
          >
            <Icon
              name={!passwordHidden ? "eye" : "eye-with-line"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );
};
export default MyInput;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 15,
    backgroundColor: "white",
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    elevation: 3,
  },
  input: { flex: 1 },
  error: {
    marginTop: 5,
    color: COLORS.error,
    fontSize: 14,
  },
});
