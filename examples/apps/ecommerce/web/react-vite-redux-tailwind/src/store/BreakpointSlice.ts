import { createSlice } from "@reduxjs/toolkit";

/* Stores the breakpoint being applied from the list of Breakpoints */
const initialState = {
    currentBreakpoint: ""
}

const BreakpointSlice = createSlice({
    name: "breakpointSlice",
    initialState,
    reducers: {
        updateBreakpoint(state, {payload}){
            state.currentBreakpoint = payload
        }
    }
})

export const {updateBreakpoint} = BreakpointSlice.actions;
export default BreakpointSlice;