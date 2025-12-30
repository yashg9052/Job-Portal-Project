import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
  user:{}
};

const Slice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    clearJobs: (state) => {
      state.jobs = [];
    },
    setUser:(state,action)=>{
      state.user=action.payload;
    },
    getUser:(state)=>{
      return state.user
    }
  },
});
export const { setJobs, clearJobs,setUser,getUser } = Slice.actions;
export default Slice.reducer;
