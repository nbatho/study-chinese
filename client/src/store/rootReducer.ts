import { combineReducers } from "@reduxjs/toolkit";
import { appReducer, authReducer } from "./modules";

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
});

export default rootReducer;
