// import { createSlice } from "@reduxjs/toolkit";

// const initialValue = {
//     addressList : []
// }

// const addressSlice = createSlice({
//     name : 'address',
//     initialState : initialValue,
//     reducers : {
//         handleAddAddress : (state,action)=>{
//             state.addressList = [...action.payload]
//         }
//     }
// })

// export const {handleAddAddress  } = addressSlice.actions

// export default addressSlice.reducer



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk: Lấy thông tin người dùng (bao gồm address list)
export const getUserDetails = createAsyncThunk(
  'address/getUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/user/details');
      return res.data.address || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi lấy địa chỉ');
    }
  }
);

// Async thunk: Xóa địa chỉ
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/user/address/${addressId}`);
      return addressId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi xóa địa chỉ');
    }
  }
);

const initialValue = {
  addressList: [],
  loading: false,
  error: null
};

const addressSlice = createSlice({
  name: 'address',
  initialState: initialValue,
  reducers: {
    handleAddAddress: (state, action) => {
      state.addressList = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      // GET USER DETAILS
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.addressList = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE ADDRESS
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addressList = state.addressList.filter(
          (address) => address._id !== action.payload
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { handleAddAddress } = addressSlice.actions;
export default addressSlice.reducer;
