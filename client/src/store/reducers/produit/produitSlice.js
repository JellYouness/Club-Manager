import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('userToken');

export const fetchProduits = createAsyncThunk('fetchProduits', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}/api/produits`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchProduit = createAsyncThunk('fetchProduit', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}api/produits/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteProduit = createAsyncThunk('deleteProduit', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}/api/produits/${id}`, {
            method: 'DELETE'
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertProduit = createAsyncThunk('insertProduit', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}/api/produits`,
            {
                id: item.id,
                nom: item.nom,
                prix: item.prix,
                reference: item.reference,
                stock: item.stock,
                description: item.description,
                image: item.image
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

export const editProduit = createAsyncThunk('editProduit', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}/api/produits/${item.id}`, {
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

const produitSlice = createSlice({
    name: 'produits',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        [fetchProduit.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchProduit.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [fetchProduit.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //fetch users
        [fetchProduits.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchProduits.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchProduits.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertProduit.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertProduit.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertProduit.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteProduit.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteProduit.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteProduit.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editProduit.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editProduit.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editProduit.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default produitSlice.reducer;
