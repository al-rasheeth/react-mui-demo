import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useQuery } from '@tanstack/react-query';

// Types for our breadcrumb structure
type BreadcrumbSegment = {
  label: string;
  path: string;
  dynamic?: boolean;
  fetchKey?: string;
};

// Mock API functions - replace with real API calls in production
const fetchProductName = async (productId: string) => {
  // In a real app, this would be an actual API call
  // return axios.get(`/api/products/${productId}`).then(res => res.data.name);
  
  // Simulating API response delay
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`Product ${productId}`);
    }, 300);
  });
};

const fetchServiceName = async (serviceId: string) => {
  // In a real app, this would be an actual API call
  // return axios.get(`/api/services/${serviceId}`).then(res => res.data.name);
  
  // Simulating API response delay
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`Service ${serviceId}`);
    }, 300);
  });
};

// Map of routes to their breadcrumb configurations
const ROUTE_CONFIG: Record<string, BreadcrumbSegment[]> = {
  '/': [{ label: 'home', path: '/' }],
  '/about': [
    { label: 'home', path: '/' },
    { label: 'about', path: '/about' }
  ],
  '/dashboard': [
    { label: 'home', path: '/' },
    { label: 'dashboard', path: '/dashboard' }
  ],
  '/demos/form': [
    { label: 'home', path: '/' },
    { label: 'dashboard', path: '/dashboard' },
    { label: 'form', path: '/demos/form' }
  ],
  '/products': [
    { label: 'home', path: '/' },
    { label: 'products', path: '/products' }
  ],
  '/products/:productId': [
    { label: 'home', path: '/' },
    { label: 'products', path: '/products' },
    { label: 'productName', path: '/products/:productId', dynamic: true, fetchKey: 'productId' }
  ],
  '/services': [
    { label: 'home', path: '/' },
    { label: 'services', path: '/services' }
  ],
  '/services/:serviceId': [
    { label: 'home', path: '/' },
    { label: 'services', path: '/services' },
    { label: 'serviceName', path: '/services/:serviceId', dynamic: true, fetchKey: 'serviceId' }
  ],
};

/**
 * A breadcrumb component that supports dynamic values from route parameters.
 * It can fetch entity names from API calls based on route parameters.
 */
const Breadcrumbs = () => {
  const location = useLocation();
  const params = useParams();
  const { t } = useTranslation();
  
  // Find matching route configuration
  const findMatchingRoute = (): string => {
    // Try to find an exact match first
    if (ROUTE_CONFIG[location.pathname]) {
      return location.pathname;
    }

    // Try to find a parameterized match
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    for (const [routePath, config] of Object.entries(ROUTE_CONFIG)) {
      const routeSegments = routePath.split('/').filter(Boolean);
      
      if (pathSegments.length !== routeSegments.length) {
        continue;
      }
      
      let isMatch = true;
      for (let i = 0; i < routeSegments.length; i++) {
        if (routeSegments[i].startsWith(':')) {
          // This is a parameter segment, so it matches any value
          continue;
        }
        
        if (routeSegments[i] !== pathSegments[i]) {
          isMatch = false;
          break;
        }
      }
      
      if (isMatch) {
        return routePath;
      }
    }
    
    return '/'; // Default to home if no match found
  };
  
  const matchedRoute = findMatchingRoute();
  const breadcrumbs = ROUTE_CONFIG[matchedRoute] || [];
  
  // Fetch dynamic data if needed
  const dynamicSegment = breadcrumbs.find(segment => segment.dynamic && segment.fetchKey);
  const fetchKey = dynamicSegment?.fetchKey;
  const paramValue = fetchKey ? params[fetchKey] as string : undefined;
  
  const { data: entityName, isLoading } = useQuery({
    queryKey: [fetchKey, paramValue],
    queryFn: async () => {
      if (!fetchKey || !paramValue) return null;
      
      // Choose the appropriate fetch function based on the fetchKey
      if (fetchKey === 'productId') {
        return fetchProductName(paramValue);
      } else if (fetchKey === 'serviceId') {
        return fetchServiceName(paramValue);
      }
      
      return null;
    },
    enabled: !!fetchKey && !!paramValue,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Replace path parameters with actual values and translate labels
  const processedBreadcrumbs = breadcrumbs.map(segment => {
    let path = segment.path;
    
    // Get translation for the label
    // Non-dynamic segments use the translation key
    let label = segment.dynamic ? '' : t(`navigation.${segment.label}`);
    
    // Replace route parameters with actual values
    if (segment.path.includes(':')) {
      Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`:${key}`, value || '');
      });
    }
    
    // Replace dynamic label with fetched entity name
    if (segment.dynamic && segment.fetchKey && segment.fetchKey === fetchKey) {
      if (isLoading) {
        label = t('common.loading');
      } else if (entityName) {
        label = entityName;
      } else {
        // Fallback to translation if no dynamic name is available
        label = t(`navigation.${segment.label}`);
      }
    }
    
    return { ...segment, path, label };
  });
  
  return (
    <Box sx={{ mb: 3, mt: 1 }}>
      <MuiBreadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
      >
        {processedBreadcrumbs.map((crumb, index) => {
          const isLast = index === processedBreadcrumbs.length - 1;
          
          return isLast ? (
            <Typography color="text.primary" key={index}>
              {index === 0 ? <HomeIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '1.25rem' }} /> : null}
              {crumb.label}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              underline="hover"
              color="inherit"
              to={crumb.path}
              key={index}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {index === 0 ? <HomeIcon sx={{ mr: 0.5, fontSize: '1.25rem' }} /> : null}
              {crumb.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs; 