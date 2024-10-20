import { configureStore } from "@reduxjs/toolkit";
import  RequestReducer  from "../features/Request/Request";
import RequestCurrentSlice  from "../features/Request/RequestCurrent";
export const store = configureStore({
  reducer: {
    request: RequestReducer,
    requestCurrent: RequestCurrentSlice,

  },
});
