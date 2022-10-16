import { configureStore } from "@reduxjs/toolkit";
// import { legacy_createStore as createStore, combineReducers } from "redux";
import { combineReducers } from "redux";
import AuthReducer from "./reducers";

const RootReducers = combineReducers({ auth: AuthReducer });

export const store = configureStore({ reducer: RootReducers });
