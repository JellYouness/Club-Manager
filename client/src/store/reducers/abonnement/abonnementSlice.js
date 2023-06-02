import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('userToken');

export const fetchAbonnements = createAsyncThunk('fetchAbonnements', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}/api/abonnements`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchAbonnement = createAsyncThunk('fetchAbonnement', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/abonnements/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteAbonnement = createAsyncThunk('deleteAbonnement', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}/api/abonnements/${id}`, {
            method: 'DELETE'
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertAbonnement = createAsyncThunk('insertAbonnement', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}/api/abonnements`,
            {
                adherent_id: item.adherent_id,
                serie: item.serie,
                status: item.status
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

export const editAbonnement = createAsyncThunk('editAbonnement', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/abonnements/${item.id}`, {
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

const abonnementSlice = createSlice({
    name: 'abonnements',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        [fetchAbonnement.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchAbonnement.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [fetchAbonnement.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //fetch users
        [fetchAbonnements.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchAbonnements.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchAbonnements.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertAbonnement.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertAbonnement.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertAbonnement.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteAbonnement.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteAbonnement.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteAbonnement.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editAbonnement.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editAbonnement.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editAbonnement.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default abonnementSlice.reducer;
