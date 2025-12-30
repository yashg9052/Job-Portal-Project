import { configureStore } from "@reduxjs/toolkit";
import reducers from "../features/slices.js"
export const Store= configureStore({
    reducer:reducers,
})