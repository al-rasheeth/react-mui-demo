import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import HomePage from '@pages/HomePage';
import AboutPage from '@pages/AboutPage';
import DashboardPage from '@pages/DashboardPage';
import NotFoundPage from '@pages/NotFoundPage';
import FormDemo from '@pages/demos/FormDemo';
import ProductsPage from '@pages/ProductsPage';
import ProductPage from '@pages/ProductPage';
import ServicesPage from '@pages/ServicesPage';
import ServicePage from '@pages/ServicePage';

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
      {
        path: 'demos/form',
        element: <FormDemo />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'products/:productId',
        element: <ProductPage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'services/:serviceId',
        element: <ServicePage />,
      },
    ],
  },
]); 