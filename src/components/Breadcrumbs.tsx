import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation, useParams, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useQuery } from '@tanstack/react-query';
import { routeConfig } from '@config/router';

// Types for our breadcrumb structure
type BreadcrumbItem = {
  key: string;
  label: string;
  path: string;
  isDynamic: boolean;
  paramInfo?: {
    paramName: string;
    entityType: string;
    labelKey: string;
    fetchFn?: string;
  };
};

// Types for router configuration
type ParamConfig = {
  entityType: string;
  labelKey: string;
  fetchFn?: string;
};

// Helper function to determine if a segment is a parameter
const isParameterSegment = (segment: string): boolean => segment.startsWith(':');

// Parse a route pattern like '/products/:productId' into segments
const parseRoutePattern = (pattern: string): string[] => {
  return pattern.split('/').filter(Boolean);
};

// API fetch functions registry
const entityFetchers = {
  // Default fetcher used when no specific fetcher is specified
  default: async (entityType: string, id: string) => {
    // In a real app, this would be an actual API call
    // return axios.get(`/api/${entityType}/${id}`).then(res => res.data.name);
    
    // Simulating API response delay
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        if (entityType === 'products') {
          resolve(`Product ${id}`);
        } else if (entityType === 'services') {
          resolve(`Service ${id}`);
        } else {
          resolve(`${entityType} ${id}`);
        }
      }, 300);
    });
  },
  
  // Specific fetchers for different entity types
  product: async (entityType: string, id: string) => {
    // This could have different logic or endpoints specific to products
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`Product ${id}`);
      }, 300);
    });
  },
  
  service: async (entityType: string, id: string) => {
    // This could have different logic or endpoints specific to services
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`Service ${id}`);
      }, 300);
    });
  },
};

/**
 * A breadcrumb component that dynamically generates breadcrumbs based on the current route
 * and router configuration. It can fetch entity names from API calls based on route parameters
 * defined in the router configuration.
 */
const Breadcrumbs = () => {
  const location = useLocation();
  const params = useParams();
  const { t } = useTranslation();
  const matches = useMatches();
  
  // Extract current path segments
  const currentPathSegments = location.pathname.split('/').filter(Boolean);
  
  // Find all routes that match our current path pattern
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Always include home
    const breadcrumbs: BreadcrumbItem[] = [
      { key: 'home', label: t('navigation.home'), path: '/', isDynamic: false }
    ];
    
    if (currentPathSegments.length === 0) {
      return breadcrumbs;
    }
    
    // Build up the breadcrumb path for each matched segment
    let currentPath = '';
    
    // Use the routeConfig to determine breadcrumb structure
    // Get all route definitions that match a segment of our current path
    const matchedRoutes: { 
      route: any; 
      path: string; 
      hasParams: boolean;
      params?: { [key: string]: string };
    }[] = [];
    
    // Recursively search for matching routes in the route configuration
    const findMatchingRoutes = (routes: any[], basePath = '') => {
      routes.forEach(route => {
        if (route.path || route.index) {
          const fullPath = route.index 
            ? basePath 
            : (route.path.startsWith('/')
              ? route.path
              : `${basePath}/${route.path}`);
            
          // Check if this route has parameters
          const routeSegments = route.path 
            ? parseRoutePattern(route.path) 
            : [];
            
          const routeParams: { [key: string]: string } = {};
          const hasParams = routeSegments.some(segment => {
            if (isParameterSegment(segment)) {
              // Extract param name without the colon
              const paramName = segment.substring(1);
              routeParams[paramName] = '';
              return true;
            }
            return false;
          });
          
          // For routes with parameters, check if they match the pattern
          let isMatch = false;
          
          // Handle index routes
          if (route.index && location.pathname === basePath) {
            isMatch = true;
          } 
          // Handle parameterized routes
          else if (hasParams) {
            // Convert route pattern to regex for matching
            const pattern = fullPath.replace(/:[^\\/]+/g, '([^\\/]+)');
            const regex = new RegExp(`^${pattern}$`);
            isMatch = regex.test(location.pathname);
            
            // Extract parameter values if it's a match
            if (isMatch) {
              const paramNames = Object.keys(routeParams);
              
              // Update routeParams with actual values from URL params
              paramNames.forEach(paramName => {
                if (params[paramName]) {
                  routeParams[paramName] = params[paramName] as string;
                }
              });
            }
          } 
          // Handle static routes
          else {
            // For static routes, check if they're part of the current path
            const pathToMatch = fullPath.endsWith('/') 
              ? fullPath.slice(0, -1) 
              : fullPath;
            
            // Check if current path starts with or equals this route's path
            isMatch = location.pathname === pathToMatch || 
                     (currentPathSegments.length > 0 && 
                      location.pathname.startsWith(pathToMatch + '/'));
          }
          
          if (isMatch) {
            matchedRoutes.push({ 
              route, 
              path: fullPath, 
              hasParams,
              params: hasParams ? routeParams : undefined
            });
          }
        }
        
        // Recursively search children
        if (route.children) {
          const childBasePath = route.path 
            ? (route.path.startsWith('/') 
              ? route.path 
              : `${basePath}/${route.path}`)
            : basePath;
            
          findMatchingRoutes(route.children, childBasePath);
        }
      });
    };
    
    findMatchingRoutes(routeConfig);
    
    // Sort matched routes by path length to get the most specific matches first
    matchedRoutes.sort((a, b) => {
      // Compare by path segment count
      const aSegments = a.path.split('/').filter(Boolean).length;
      const bSegments = b.path.split('/').filter(Boolean).length;
      return bSegments - aSegments;
    });
    
    // Use matches to build breadcrumbs
    for (let i = 0; i < currentPathSegments.length; i++) {
      const segment = currentPathSegments[i];
      currentPath += `/${segment}`;
      
      // Find the matching route for this path level
      const matchingRouteIndex = matchedRoutes.findIndex(match => {
        const matchPath = match.path.endsWith('/') 
          ? match.path.slice(0, -1) 
          : match.path;
          
        return matchPath === currentPath;
      });
      
      if (matchingRouteIndex === -1) {
        // No matching route found for this segment, just add a simple breadcrumb
        breadcrumbs.push({
          key: segment,
          label: t(`navigation.${segment}`),
          path: currentPath,
          isDynamic: false
        });
        continue;
      }
      
      const matchingRoute = matchedRoutes[matchingRouteIndex];
      
      // Check if this segment is a parameter value
      let paramInfo;
      let isDynamicSegment = false;
      
      if (matchingRoute.hasParams && matchingRoute.route.params) {
        // Check each parameter in the route configuration
        Object.entries(matchingRoute.route.params).forEach(([paramName, paramConfigRaw]) => {
          // Cast to the correct type
          const paramConfig = paramConfigRaw as ParamConfig;
          
          // If this parameter value matches our current segment
          if (params[paramName] === segment) {
            isDynamicSegment = true;
            paramInfo = {
              paramName,
              entityType: paramConfig.entityType,
              labelKey: paramConfig.labelKey,
              fetchFn: paramConfig.fetchFn
            };
          }
        });
      }
      
      // Get breadcrumb label from route configuration or fallback to segment name
      let breadcrumbKey = segment;
      
      if (isDynamicSegment && paramInfo?.labelKey) {
        breadcrumbKey = paramInfo.labelKey;
      } else if (matchingRoute.route.breadcrumb) {
        breadcrumbKey = matchingRoute.route.breadcrumb;
      }
      
      breadcrumbs.push({
        key: breadcrumbKey,
        label: isDynamicSegment ? '' : t(`navigation.${breadcrumbKey}`),
        path: currentPath,
        isDynamic: isDynamicSegment,
        paramInfo
      });
    }
    
    return breadcrumbs;
  };
  
  // Generate the breadcrumbs based on the current route
  const breadcrumbs = generateBreadcrumbs();
  
  // Find dynamic segments that need data fetching
  const dynamicBreadcrumbs = breadcrumbs.filter(item => item.isDynamic && item.paramInfo);
  
  // Create a query for each dynamic breadcrumb
  const dynamicQueries = dynamicBreadcrumbs.map(breadcrumb => {
    const { paramInfo } = breadcrumb;
    
    if (!paramInfo) return null;
    
    const paramValue = params[paramInfo.paramName] as string;
    const fetcherName = paramInfo.fetchFn || 'default';
    const fetcher = entityFetchers[fetcherName as keyof typeof entityFetchers] || entityFetchers.default;
    
    const { data, isLoading } = useQuery({
      queryKey: ['entity', paramInfo.entityType, paramValue, fetcherName],
      queryFn: () => fetcher(paramInfo!.entityType, paramValue),
      enabled: !!paramValue,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
    
    return { breadcrumb, data, isLoading };
  }).filter(Boolean) as { breadcrumb: BreadcrumbItem; data: string | undefined; isLoading: boolean }[];
  
  // Process breadcrumbs with dynamic data
  const processedBreadcrumbs = breadcrumbs.map(breadcrumb => {
    if (breadcrumb.isDynamic && breadcrumb.paramInfo) {
      // Find the corresponding query result
      const queryResult = dynamicQueries.find(q => q?.breadcrumb === breadcrumb);
      
      if (queryResult) {
        return {
          ...breadcrumb,
          label: queryResult.isLoading 
            ? t('common.loading') 
            : queryResult.data || t(`navigation.${breadcrumb.key}`)
        };
      }
    }
    return breadcrumb;
  });
  
  return (
    <Box sx={{ mb: 3, mt: 1 }}>
      <MuiBreadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        maxItems={8}
        itemsBeforeCollapse={2}
        itemsAfterCollapse={2}
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