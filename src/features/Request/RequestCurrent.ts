import { createSlice } from "@reduxjs/toolkit";

let requestCurrent = null;

try {
  const requestsFromLocalStoraage = localStorage.getItem("requestCurrent");
  if (requestsFromLocalStoraage) {
    requestCurrent = JSON.parse(requestsFromLocalStoraage);
  }
} catch (error) {
  console.error("Error al parsear el JSON del usuario:", error);
  localStorage.removeItem("requestCurrent");
}

const initialState = {
  requestCurrent: requestCurrent,
};

export const RequestCurrentSlice = createSlice({
  name: "requestCurrent",
  initialState,
  reducers: {
    changeRequestCurrent: (state, action) => {
      const data = action.payload;
      localStorage.setItem("requestCurrent",JSON.stringify(data))
      state.requestCurrent = data;
    },
  },
});

export const { changeRequestCurrent } = RequestCurrentSlice.actions;

export default RequestCurrentSlice.reducer;
