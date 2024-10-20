import { createSlice } from "@reduxjs/toolkit";

let request = null;

try {
  const requestsFromLocalStoraage = localStorage.getItem("requests");
  if (requestsFromLocalStoraage) {
    request = JSON.parse(requestsFromLocalStoraage);
  }
} catch (error) {
  console.error("Error al parsear el JSON del usuario:", error);
  localStorage.removeItem("requests");
}

const initialState = {
  request: request,
};

export const RequestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    changeRequest: (state, action) => {
      const data = action.payload;
      state.request = data;
    },
  },
});

export const { changeRequest } = RequestSlice.actions;

export default RequestSlice.reducer;
