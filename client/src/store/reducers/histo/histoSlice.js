import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('userToken');

export const fetchHistos = createAsyncThunk('fetchHistos', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}/api/historiques`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchHisto = createAsyncThunk('fetchHisto', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/historiques/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const histoSlice = createSlice({
    name: 'histos',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        [fetchHisto.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchHisto.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [fetchHisto.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //fetch users
        [fetchHistos.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchHistos.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchHistos.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default histoSlice.reducer;
