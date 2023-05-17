// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined
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
            icon: icons.FontSizeOutlined
        },
        {
            id: 'util-abonnements',
            title: 'Abonnements',
            type: 'item',
            url: '/abonnements',
            icon: icons.BgColorsOutlined
        },
        {
            id: 'util-services',
            title: 'Services',
            type: 'item',
            url: '/services',
            icon: icons.BarcodeOutlined
        },
        {
            id: 'util-produits',
            title: 'Produits',
            type: 'item',
            url: '/produits',
            icon: icons.BarcodeOutlined
        },
        {
            id: 'util-portes',
            title: 'Portes',
            type: 'item',
            url: '/portes',
            icon: icons.BarcodeOutlined
        },
        {
            id: 'util-lecteurs',
            title: 'Lecteurs',
            type: 'item',
            url: '/lecteurs',
            icon: icons.BarcodeOutlined
        },
        {
            id: 'util-cartes',
            title: 'Cartes',
            type: 'item',
            url: '/cartes',
            icon: icons.BarcodeOutlined
        },
        {
            id: 'util-historique',
            title: `Historique d'access`,
            type: 'item',
            url: '/historique',
            icon: icons.BarcodeOutlined
        },
        {
            id: 'util-utilisateurs',
            title: 'Utilisateurs',
            type: 'item',
            url: '/utilisateurs',
            icon: icons.AntDesignOutlined
        }
    ]
};

export default utilities;
