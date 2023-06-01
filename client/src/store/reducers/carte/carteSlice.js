import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('userToken');

export const fetchCartes = createAsyncThunk('fetchCartes', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}/api/cartes`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchCarte = createAsyncThunk('fetchCarte', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/cartes/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteCarte = createAsyncThunk('deleteCarte', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}/api/cartes/${id}`, {
            method: 'DELETE'
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertCarte = createAsyncThunk('insertCarte', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}/api/cartes`,
            {
                adherent_id: item.adherent_id,
                date_creation: item.date
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

export const editCarte = createAsyncThunk('editCarte', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/cartes/${item.id}`, {
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

const carteSlice = createSlice({
    name: 'cartes',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        [fetchCarte.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchCarte.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [fetchCarte.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //fetch users
        [fetchCartes.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchCartes.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchCartes.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertCarte.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertCarte.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertCarte.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteCarte.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteCarte.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteCarte.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editCarte.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editCarte.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editCarte.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default carteSlice.reducer;
