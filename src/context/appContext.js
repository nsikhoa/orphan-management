import React, { useReducer } from "react";
import createDataContext from "./createDataContext";

const staffReducer = (state, action) => {
  switch (action.type) {
    case "add_staff":
      return [...state, { name: `Name #${state.length + 1}` }];
    default:
      return state;
  }
};

const addStaff = (dispatch) => {
  return () => {
    dispatch({ type: "add_staff" });
  };
};

export const { Context, Provider } = createDataContext(
  staffReducer,
  { addStaff },
  []
);
