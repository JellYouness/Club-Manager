// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import authSlice from './auth/authSlice';
import adherentSlice from './adherent/adherentSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu: menu, auth: authSlice, adherents: adherentSlice });

export default reducers;
