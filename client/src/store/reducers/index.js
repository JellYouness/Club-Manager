// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import authSlice from './auth/authSlice';
import adherentSlice from './adherent/adherentSlice';
import produitSlice from './produit/produitSlice';
import serviceSlice from './service/serviceSlice';
import porteSlice from './porte/porteSlice';
import lecteurSlice from './lecteur/lecteurSlice';
import histoSlice from './histo/histoSlice';
import carteSlice from './carte/carteSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu: menu,
    auth: authSlice,
    adherents: adherentSlice,
    produits: produitSlice,
    services: serviceSlice,
    portes: porteSlice,
    lecteurs: lecteurSlice,
    histos: histoSlice,
    cartes: carteSlice
});

export default reducers;
