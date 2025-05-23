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
};

// Helper function to determine if a segment is a parameter
const isParameterSegment = (segment: string): boolean => segment.startsWith(':');

// Parse a route pattern like '/products/:productId' into segments
const parseRoutePattern = (pattern: string): string[] => {
  return pattern.split('/').filter(Boolean);
};

// Mock API functions - replace with real API calls in production
const fetchEntityName = async (type: string, id: string) => {
  // In a real app, this would be an actual API call
  // return axios.get(`/api/${type}/${id}`).then(res => res.data.name);
  
  // Simulating API response delay
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      if (type === 'products') {
        resolve(`Product ${id}`);
      } else if (type === 'services') {
        resolve(`Service ${id}`);
      } else {
        resolve(`${type} ${id}`);
      }
    }, 300);
  });
};

/**
 * A breadcrumb component that dynamically generates breadcrumbs based on the current route
 * and router configuration. It can fetch entity names from API calls based on route parameters.
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
    const matchedRoutes: { route: any; path: string; hasDynamicParam: boolean }[] = [];
    
    // Recursively search for matching routes in the route configuration
    const findMatchingRoutes = (routes: any[], basePath = '') => {
      routes.forEach(route => {
        if (route.path) {
          const fullPath = route.path.startsWith('/')
            ? route.path
            : `${basePath}/${route.path}`;
            
          // Check if this route matches a segment of our current path
          const routeSegments = parseRoutePattern(fullPath);
          const hasDynamicParam = routeSegments.some(isParameterSegment);
          
          // For routes with parameters, check if they match the pattern
          let isMatch = false;
          
          if (hasDynamicParam) {
            // For dynamic routes, compare segment lengths and non-param segments
            if (routeSegments.length <= currentPathSegments.length) {
              isMatch = routeSegments.every((segment, i) => {
                if (isParameterSegment(segment)) {
                  // Parameter segments automatically match
                  return true;
                }
                return segment === currentPathSegments[i];
              });
            }
          } else {
            // For static routes, check if they're an exact prefix match
            const pathPattern = fullPath.endsWith('/') ? fullPath.slice(0, -1) : fullPath;
            isMatch = location.pathname.startsWith(pathPattern);
          }
          
          if (isMatch) {
            matchedRoutes.push({ 
              route, 
              path: fullPath, 
              hasDynamicParam 
            });
          }
        }
        
        // Recursively search children
        if (route.children) {
          const childBasePath = route.path || basePath;
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
      
      // Find the matching route for this segment
      const matchingRoute = matchedRoutes.find(match => {
        const routeSegments = parseRoutePattern(match.path);
        
        // Check if this route matches the current segment level
        if (routeSegments.length === i + 1) {
          const lastSegment = routeSegments[i];
          return lastSegment === segment || isParameterSegment(lastSegment);
        }
        return false;
      });
      
      // Determine if this is a dynamic segment
      const isDynamicSegment = !!matchingRoute?.hasDynamicParam && 
                               Object.values(params).includes(segment);
      
      // Get breadcrumb label from route configuration or fallback to segment name
      let breadcrumbKey = segment;
      if (matchingRoute?.route.breadcrumb) {
        breadcrumbKey = matchingRoute.route.breadcrumb;
      }
      
      breadcrumbs.push({
        key: breadcrumbKey,
        label: isDynamicSegment ? '' : t(`navigation.${breadcrumbKey}`),
        path: currentPath,
        isDynamic: isDynamicSegment,
      });
    }
    
    return breadcrumbs;
  };
  
  // Generate the breadcrumbs based on the current route
  const breadcrumbs = generateBreadcrumbs();
  
  // Find dynamic segments that need data fetching
  const dynamicSegment = breadcrumbs.find(item => item.isDynamic);
  const dynamicIndex = dynamicSegment ? breadcrumbs.indexOf(dynamicSegment) : -1;
  
  // Determine entity type and ID for API fetching
  // In real applications, this should be more robust
  let entityType: string | null = null;
  let entityId: string | null = null;
  
  if (dynamicIndex > 0) {
    // The previous segment path is typically the collection type (e.g., "products")
    // Extract it from path like "/products/123" → "products"
    const dynamicPath = breadcrumbs[dynamicIndex].path;
    const dynamicPathSegments = dynamicPath.split('/').filter(Boolean);
    
    // The actual ID is the last segment
    entityId = dynamicPathSegments[dynamicPathSegments.length - 1];
    
    // The entity type is the second-to-last segment
    if (dynamicPathSegments.length > 1) {
      entityType = dynamicPathSegments[dynamicPathSegments.length - 2];
    }
  }
  
  // Fetch dynamic entity name if needed
  const { data: entityName, isLoading } = useQuery({
    queryKey: ['entity', entityType, entityId],
    queryFn: () => fetchEntityName(entityType!, entityId!),
    enabled: !!entityType && !!entityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Process breadcrumbs with dynamic data
  const processedBreadcrumbs = breadcrumbs.map(breadcrumb => {
    if (breadcrumb.isDynamic) {
      return {
        ...breadcrumb,
        label: isLoading 
          ? t('common.loading') 
          : entityName || t(`navigation.${breadcrumb.key}`)
      };
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