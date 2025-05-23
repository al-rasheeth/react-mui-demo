import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import HomePage from '@pages/HomePage';
import AboutPage from '@pages/AboutPage';
import DashboardPage from '@pages/DashboardPage';
import NotFoundPage from '@pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]); 