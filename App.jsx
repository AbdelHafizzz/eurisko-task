import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screens/Login";
import Articles from "./screens/Articles";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { Text, TouchableOpacity } from "react-native";
import COLORS from "./utils/colors";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MyStack = () => {
  const dispatch = useDispatch();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="articles"
        component={Articles}
        options={() => ({
          headerShown: true,
          title: "Articles",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => dispatch({ type: "LOGOUT", payload: null })}
            >
              <Text
                style={{ textAlign: "right", color: COLORS.blue, fontSize: 16 }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          ),
          headerRightContainerStyle: { marginRight: 15 },
        })}
      />
    </Stack.Navigator>
  );
};

const Main = () => {
  const token = useSelector((state) => state.auth.authToken);
  return (
    <NavigationContainer>
      {token !== null ? <MyStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
