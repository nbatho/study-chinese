import { combineReducers } from "@reduxjs/toolkit";
import {
  achievementReducer,
  appReducer,
  authReducer,
  dashboardReducer,
  lessonReducer,
  listReducer,
  srsReducer,
  userReducer,
} from "./modules";

const rootReducer = combineReducers({
  achievements: achievementReducer,
  app: appReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  lessons: lessonReducer,
  lists: listReducer,
  srs: srsReducer,
  user: userReducer,
});

export default rootReducer;
