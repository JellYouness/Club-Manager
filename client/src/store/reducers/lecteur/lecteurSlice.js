import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('userToken');

export const fetchLecteurs = createAsyncThunk('fetchLecteurs', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}/api/lecteurs`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchLecteur = createAsyncThunk('fetchLecteur', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/lecteurs/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteLecteurfetchLecteur = createAsyncThunk('deleteLecteurfetchLecteur', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}/api/lecteurs/${id}`, {
            method: 'DELETE'
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertLecteurfetchLecteur = createAsyncThunk('insertLecteurfetchLecteur', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}/api/lecteurs`,
            {
                porte_id: item.porte_id,
                status: item.status,
                nom: item.nom,
                serie: item.serie
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

export const editLecteurfetchLecteur = createAsyncThunk('editLecteurfetchLecteur', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/lecteurs/${item.id}`, {
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

const lecteurSlice = createSlice({
    name: 'lecteurs',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        [fetchLecteur.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchLecteur.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [fetchLecteur.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //fetch users
        [fetchLecteurs.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchLecteurs.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchLecteurs.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertLecteurfetchLecteur.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertLecteurfetchLecteur.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertLecteurfetchLecteur.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteLecteurfetchLecteur.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteLecteurfetchLecteur.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteLecteurfetchLecteur.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editLecteurfetchLecteur.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editLecteurfetchLecteur.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editLecteurfetchLecteur.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default lecteurSlice.reducer;
