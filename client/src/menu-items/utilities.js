import {
    CreditCard,
    Sensors,
    History,
    LocalOffer,
    MeetingRoom,
    ManageAccounts,
    FitnessCenter,
    WifiTethering,
    People
} from '@mui/icons-material';

// icons
const icons = {
    People,
    CreditCard,
    Sensors,
    History,
    LocalOffer,
    MeetingRoom,
    ManageAccounts,
    FitnessCenter,
    WifiTethering
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: [
        {
            id: 'util-adherents',
            title: 'Adherents',
            type: 'item',
            url: '/adherents',
            icon: icons.People
        },
        {
            id: 'util-abonnements',
            title: 'Abonnements',
            type: 'item',
            url: '/abonnements',
            icon: icons.FitnessCenter
        },
        {
            id: 'util-services',
            title: 'Services',
            type: 'item',
            url: '/services',
            icon: icons.WifiTethering
        },
        {
            id: 'util-produits',
            title: 'Produits',
            type: 'item',
            url: '/produits',
            icon: icons.LocalOffer
        },
        {
            id: 'util-portes',
            title: 'Portes',
            type: 'item',
            url: '/portes',
            icon: icons.MeetingRoom
        },
        {
            id: 'util-lecteurs',
            title: 'Lecteurs',
            type: 'item',
            url: '/lecteurs',
            icon: icons.Sensors
        },
        {
            id: 'util-cartes',
            title: 'Cartes',
            type: 'item',
            url: '/cartes',
            icon: icons.CreditCard
        },
        {
            id: 'util-historique',
            title: `Historique d'access`,
            type: 'item',
            url: '/historique',
            icon: icons.History
        },
        {
            id: 'util-utilisateurs',
            title: 'Utilisateurs',
            type: 'item',
            url: '/utilisateurs',
            icon: icons.ManageAccounts
        }
    ]
};

export default utilities;
