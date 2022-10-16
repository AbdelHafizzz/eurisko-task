import React, { useEffect } from "react";
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import MyInput from "../components/MyInput";
import Logo from "../assets/logo.png";
import Loader from "../components/Loader";
import COLORS from "../utils/colors";
import { useDispatch } from "react-redux";
import axios from "axios";

const LoginScreen = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [error, setDisplayError] = useState(false);
  const [errors, setErrors] = useState({});

  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      setBtnDisabled(true);
    } else {
      inputs.username || inputs.password
        ? setBtnDisabled(false)
        : setBtnDisabled(true);
    }
  }, [inputs.username, inputs.password]);

  const handleSaveUser = async (value) => {
    dispatch({ type: "LOGIN", payload: { token: value, userData: inputs } });
  };

  const handleFetchLogin = async () => {
    setDisplayError(false);
    setIsLoading(true);
    const headers = {
      "content-type": "application/json",
    };

    await axios
      .post(
        `http://34.245.213.76:3000/auth/signin`,
        {
          username: inputs.username.split(" ")[0].toLowerCase(),
          password: inputs.password,
        },
        { headers: headers }
      )
      .then((res) => {
        handleSaveUser(res.data.accessToken);
        setIsLoading(false);
      })
      .catch((error) => {
        setDisplayError(true);
        setIsLoading(false);
        console.log(error);
      });
  };

  const checkAllValid = () => {
    Keyboard.dismiss();
    let valid = true;

    if (!inputs.username) {
      handleError("Please enter a username", "username");
      valid = false;
    }

    if (!inputs.password) {
      handleError("Please enter a password", "password");
      valid = false;
    }

    valid && handleFetchLogin();
  };

  const handleOnChange = (text, input) => {
    setInputs((prev) => ({ ...prev, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setDisplayError(false);
    setErrors((prev) => ({ ...prev, [input]: errorMessage }));
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.logoContainer}>
            <Image source={Logo} />
          </View>
          <MyInput
            onFocus={() => {
              handleError(null, "username");
            }}
            onChangeText={(value) => handleOnChange(value, "username")}
            error={errors?.username}
            type="text"
            placeholder="Username"
          />
          <MyInput
            onFocus={() => {
              handleError(null, "password");
            }}
            onChangeText={(value) => handleOnChange(value, "password")}
            error={errors?.password}
            type="password"
            placeholder="Password"
          />
          <View style={{ position: "relative" }}>
            {error && (
              <Text style={styles.error}>wrong username or password</Text>
            )}
            <TouchableOpacity
              style={
                btnDisabled
                  ? {
                      ...styles.btn,
                      ...styles.disabledBtn,
                    }
                  : styles.btn
              }
              onPress={() => checkAllValid()}
              disabled={btnDisabled}
            >
              <Text style={styles.uploadBtnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 40,
    marginTop: 10,
    alignSelf: "center",
  },
  btn: {
    borderRadius: 10,
    width: "40%",
    height: 45,
    padding: 10,
    shadowColor: COLORS.black,
    elevation: 3,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "rgb(37, 150, 190)",
    alignSelf: "center",
  },
  disabledBtn: {
    backgroundColor: COLORS.gray,
  },
  uploadBtnText: {
    color: COLORS.white,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  error: {
    marginTop: 5,
    color: COLORS.error,
    fontSize: 14,
    textAlign: "center",
  },
});
