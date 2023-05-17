import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Adherents = Loadable(lazy(() => import('pages/components/Adherents/Adherents')));
const Abonnements = Loadable(lazy(() => import('pages/components/Abonnements/Abonnements')));
const Services = Loadable(lazy(() => import('pages/components/Services/Services')));
const Produits = Loadable(lazy(() => import('pages/components/Produits/Produits')));
const Portes = Loadable(lazy(() => import('pages/components/Portes/Portes')));
const Lecteurs = Loadable(lazy(() => import('pages/components/Lecteurs/Lecteurs')));
const Cartes = Loadable(lazy(() => import('pages/components/Cartes/Cartes')));
const HistoriqueAccess = Loadable(lazy(() => import('pages/components/Historique/HistoriqueAccess')));
const Utilisateurs = Loadable(lazy(() => import('pages/components/Utilisateurs/Utilisateurs')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'adherents',
            element: <Adherents />
        },
        {
            path: 'abonnements',
            element: <Abonnements />
        },
        {
            path: 'services',
            element: <Services />
        },
        {
            path: 'produits',
            element: <Produits />
        },
        {
            path: 'portes',
            element: <Portes />
        },
        {
            path: 'lecteurs',
            element: <Lecteurs />
        },
        {
            path: 'cartes',
            element: <Cartes />
        },
        {
            path: 'historique',
            element: <HistoriqueAccess />
        },
        {
            path: 'utilisateurs',
            element: <Utilisateurs />
        },
        {
            path: 'icons/ant',
            element: <AntIcons />
        }
    ]
};

export default MainRoutes;
