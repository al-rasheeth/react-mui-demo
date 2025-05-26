import { createBrowserRouter, RouteObject } from 'react-router-dom';
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

// Extend the route configuration with custom metadata
interface BreadcrumbMeta {
  breadcrumb?: string; // Translation key for breadcrumb
  params?: {
    [paramName: string]: {
      entityType: string; // Type of entity (for API fetching)
      labelKey: string; // Translation key for fallback label
      fetchFn?: string; // Name of fetch function to use (optional)
    };
  };
}

// Define routes with breadcrumb metadata
const routes: (RouteObject & BreadcrumbMeta)[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        breadcrumb: 'home',
      },
      {
        path: 'about',
        element: <AboutPage />,
        breadcrumb: 'about',
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
        breadcrumb: 'dashboard',
      },
      {
        path: 'demos/form',
        element: <FormDemo />,
        breadcrumb: 'form',
      },
      {
        path: 'products',
        element: <ProductsPage />,
        breadcrumb: 'products',
      },
      {
        path: 'products/:productId',
        element: <ProductPage />,
        breadcrumb: 'productName',
        params: {
          productId: {
            entityType: 'products',
            labelKey: 'productName',
            fetchFn: 'product' // Optional: can specify which fetch function to use
          }
        }
      },
      {
        path: 'services',
        element: <ServicesPage />,
        breadcrumb: 'services',
      },
      {
        path: 'services/:serviceId',
        element: <ServicePage />,
        breadcrumb: 'serviceName',
        params: {
          serviceId: {
            entityType: 'services',
            labelKey: 'serviceName',
            fetchFn: 'service'
          }
        }
      },
    ] as (RouteObject & BreadcrumbMeta)[],
  },
];

// Export route metadata for use in breadcrumbs
export const routeConfig = routes;

// Create router from route configuration
export const router = createBrowserRouter(routes); 