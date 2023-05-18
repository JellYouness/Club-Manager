import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('userToken');

export const fetchAdherents = createAsyncThunk('fetchAdherents', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}/api/adherents`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchAdherent = createAsyncThunk('fetchAdherent', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}api/adherents/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteAdherent = createAsyncThunk('deleteAdherent', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}/api/adherents/${id}`, {
            method: 'DELETE'
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertAdherent = createAsyncThunk('insertAdherent', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}/api/adherents`,
            {
                email: item.email,
                name: item.name,
                telephone: item.telephone,
                password: item.password,
                role_id: item.role_id
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
        console.log(error);
        return rejectWithValue(error.message);
    }
});

export const editAdherent = createAsyncThunk('editAdherent', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}api/adherents/${item.id}`, {
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

const adherentSlice = createSlice({
    name: 'adherents',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        [fetchAdherent.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchAdherent.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [fetchAdherent.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //fetch users
        [fetchAdherents.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchAdherents.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchAdherents.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertAdherent.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertAdherent.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertAdherent.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteAdherent.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteAdherent.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteAdherent.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editAdherent.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editAdherent.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editAdherent.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default adherentSlice.reducer;
