import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('userToken');

export const fetchServices = createAsyncThunk('fetchServices', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}/api/services`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchService = createAsyncThunk('fetchService', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/services/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteService = createAsyncThunk('deleteService', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}/api/services/${id}`, {
            method: 'DELETE'
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertService = createAsyncThunk('insertService', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}/api/services`,
            {
                id: item.id,
                nom: item.nom,
                prix: item.prix,
                status: item.status,
                description: item.description
            },
            {
                body: JSON.stringify(item),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await res.config.data;
        return data;
    } catch (error) {
        console.log(error.response.data);
        return rejectWithValue(error.message);
    }
});

export const editService = createAsyncThunk('editService', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/services/${item.id}`, {
            method: 'PATCH',
            body: JSON.stringify(item),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        [fetchService.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchService.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [fetchService.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //fetch users
        [fetchServices.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchServices.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchServices.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertService.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertService.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertService.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteService.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteService.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteService.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editService.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editService.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editService.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default serviceSlice.reducer;
