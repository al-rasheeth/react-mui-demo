import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Alert, 
  Chip, 
  Button, 
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Tab,
  Tabs,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ApiIcon from '@mui/icons-material/Api';
import SchemaIcon from '@mui/icons-material/Schema';
import CodeIcon from '@mui/icons-material/Code';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import TerminalIcon from '@mui/icons-material/Terminal';
import JsonIcon from '@mui/icons-material/DataObject';
import SecurityIcon from '@mui/icons-material/Security';
import HubIcon from '@mui/icons-material/Hub';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DownloadIcon from '@mui/icons-material/Download';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import LanguageIcon from '@mui/icons-material/Language';
import { OasValidationResult } from '../../utils/oasValidation';
import SchemaViewer from './SchemaViewer';

interface ValidationStepProps {
  isValidating: boolean;
  validationResult: OasValidationResult | null;
  oasDocument: any | null;
  onValidate: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`validation-tabpanel-${index}`}
      aria-labelledby={`validation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// Add a visualization component for endpoints
const EndpointsVisualization: React.FC<{ oasDocument: any }> = ({ oasDocument }) => {
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({});
  
  if (!oasDocument || !oasDocument.paths) {
    return <Alert severity="info">No endpoints available to visualize</Alert>;
  }
  
  // Group endpoints by path
  const endpointsByPath: Record<string, Array<{ method: string; operation: any }>> = {};
  
  Object.entries(oasDocument.paths).forEach(([path, pathItem]: [string, any]) => {
    const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
    
    methods.forEach(method => {
      if (pathItem[method]) {
        if (!endpointsByPath[path]) {
          endpointsByPath[path] = [];
        }
        endpointsByPath[path].push({
          method,
          operation: pathItem[method]
        });
      }
    });
  });
  
  const handleToggleExpand = (path: string) => {
    setExpandedEndpoints(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'success';
      case 'POST': return 'primary';
      case 'PUT': return 'warning';
      case 'DELETE': return 'error';
      case 'PATCH': return 'info';
      default: return 'default';
    }
  };
  
  return (
    <Stack spacing={2}>
      {Object.entries(endpointsByPath).map(([path, methods]) => (
        <Paper key={path} variant="outlined" sx={{ overflow: 'hidden' }}>
          <Box 
            sx={{ 
              p: 1.5, 
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              borderBottom: expandedEndpoints[path] ? '1px solid' : 'none',
              borderColor: 'divider'
            }}
            onClick={() => handleToggleExpand(path)}
          >
            {expandedEndpoints[path] ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
            <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', ml: 1 }}>
              {path}
            </Typography>
          </Box>
          
          {expandedEndpoints[path] && (
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                {methods.map((method, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <Chip 
                        label={method.method.toUpperCase()} 
                        color={getMethodColor(method.method)}
                      />
                      <Typography variant="subtitle1">
                        {method.operation.summary || path}
                      </Typography>
                    </Stack>
                    
                    {method.operation.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {method.operation.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {method.operation.tags?.map((tag: string) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                      {method.operation.deprecated && (
                        <Chip label="Deprecated" size="small" color="error" />
                      )}
                    </Box>
                    
                    {/* Parameters preview */}
                    {method.operation.parameters && method.operation.parameters.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Parameters:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {method.operation.parameters.map((param: any, pidx: number) => (
                            <Chip 
                              key={pidx} 
                              label={`${param.name} (${param.in})`} 
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                    
                    {/* Response codes preview */}
                    {method.operation.responses && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Responses:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {Object.keys(method.operation.responses).map((code) => (
                            <Chip 
                              key={code} 
                              label={code} 
                              size="small"
                              color={
                                code.startsWith('2') ? 'success' :
                                code.startsWith('4') ? 'warning' :
                                code.startsWith('5') ? 'error' : 'default'
                              }
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Paper>
      ))}
    </Stack>
  );
};

// Mock version comparison component
const ApiVersionComparison: React.FC<{ oasDocument: any }> = ({ oasDocument }) => {
  // In a real application, this would fetch the previous version data
  // and calculate differences. Here we'll just show a mock view.
  
  if (!oasDocument) {
    return <Alert severity="info">No API specification available for comparison</Alert>;
  }
  
  // Mock data for demonstration
  const mockPreviousVersion = oasDocument.info?.version ? 
    oasDocument.info.version.split('.').map(Number) : [1, 0, 0];
  
  if (mockPreviousVersion[2] > 0) {
    mockPreviousVersion[2] -= 1;
  } else if (mockPreviousVersion[1] > 0) {
    mockPreviousVersion[1] -= 1;
    mockPreviousVersion[2] = 9;
  } else {
    // If we can't decrement, we'll just assume this is the first version
    return (
      <Alert severity="info">
        This appears to be the first version of this API. No comparison available.
      </Alert>
    );
  }
  
  const previousVersion = mockPreviousVersion.join('.');
  
  // Generate some mock changes based on the current spec
  const mockChanges = {
    added: {
      endpoints: [] as string[],
      schemas: [] as string[]
    },
    removed: {
      endpoints: [] as string[],
      schemas: [] as string[]
    },
    modified: {
      endpoints: [] as string[],
      schemas: [] as string[]
    }
  };
  
  // Generate mock endpoint changes
  if (oasDocument.paths) {
    const paths = Object.keys(oasDocument.paths);
    // Add 2 new endpoints
    if (paths.length >= 3) {
      mockChanges.added.endpoints.push(
        `${paths[0]} [POST]`,
        `${paths[1]} [PUT]`
      );
    } else if (paths.length > 0) {
      mockChanges.added.endpoints.push(`${paths[0]} [POST]`);
    }
    
    // Remove 1 endpoint
    mockChanges.removed.endpoints.push('/api/legacy/resource [GET]');
    
    // Modify 2 endpoints
    if (paths.length >= 2) {
      mockChanges.modified.endpoints.push(
        `${paths[paths.length - 1]} [GET]`,
        `${paths[paths.length - 2]} [DELETE]`
      );
    } else if (paths.length > 0) {
      mockChanges.modified.endpoints.push(`${paths[0]} [GET]`);
    }
  }
  
  // Generate mock schema changes
  const schemas = oasDocument.components?.schemas || oasDocument.definitions || {};
  const schemaNames = Object.keys(schemas);
  
  if (schemaNames.length > 0) {
    // Add 1 new schema
    mockChanges.added.schemas.push('NewResource');
    
    // Remove 1 schema
    mockChanges.removed.schemas.push('DeprecatedModel');
    
    // Modify 2 schemas
    if (schemaNames.length >= 2) {
      mockChanges.modified.schemas.push(
        schemaNames[0],
        schemaNames[1]
      );
    } else {
      mockChanges.modified.schemas.push(schemaNames[0]);
    }
  }
  
  return (
    <Stack spacing={3}>
      <Alert severity="info">
        Comparing current version ({oasDocument.info?.version || 'unknown'}) with previous version ({previousVersion})
      </Alert>
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Summary of Changes
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip 
            icon={<AddCircleOutlineIcon />} 
            label={`${mockChanges.added.endpoints.length + mockChanges.added.schemas.length} Additions`} 
            color="success" 
          />
          <Chip 
            icon={<RemoveCircleOutlineIcon />} 
            label={`${mockChanges.removed.endpoints.length + mockChanges.removed.schemas.length} Removals`} 
            color="error" 
          />
          <Chip 
            icon={<EditIcon />} 
            label={`${mockChanges.modified.endpoints.length + mockChanges.modified.schemas.length} Modifications`} 
            color="warning" 
          />
        </Stack>
      </Box>
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ height: '100%' }}>
            <Box sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <Typography variant="subtitle1">
                <AddCircleOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Additions
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {mockChanges.added.endpoints.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>Endpoints:</Typography>
                  <List dense>
                    {mockChanges.added.endpoints.map((endpoint, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ApiIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={endpoint} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {mockChanges.added.schemas.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>Schemas:</Typography>
                  <List dense>
                    {mockChanges.added.schemas.map((schema, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <SchemaIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={schema} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {mockChanges.added.endpoints.length === 0 && mockChanges.added.schemas.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No additions
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ height: '100%' }}>
            <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
              <Typography variant="subtitle1">
                <RemoveCircleOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Removals
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {mockChanges.removed.endpoints.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>Endpoints:</Typography>
                  <List dense>
                    {mockChanges.removed.endpoints.map((endpoint, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ApiIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={endpoint} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {mockChanges.removed.schemas.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>Schemas:</Typography>
                  <List dense>
                    {mockChanges.removed.schemas.map((schema, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <SchemaIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={schema} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {mockChanges.removed.endpoints.length === 0 && mockChanges.removed.schemas.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No removals
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ height: '100%' }}>
            <Box sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <Typography variant="subtitle1">
                <EditIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Modifications
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {mockChanges.modified.endpoints.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>Endpoints:</Typography>
                  <List dense>
                    {mockChanges.modified.endpoints.map((endpoint, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ApiIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={endpoint} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {mockChanges.modified.schemas.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>Schemas:</Typography>
                  <List dense>
                    {mockChanges.modified.schemas.map((schema, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <SchemaIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={schema} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {mockChanges.modified.endpoints.length === 0 && mockChanges.modified.schemas.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No modifications
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

// Add this new component for enhanced statistics display
const ApiStatisticsPanel = ({ oasDocument, validationResult }: { oasDocument: any, validationResult: OasValidationResult }) => {
  if (!oasDocument) return null;
  
  // Get all unique tags in the API
  const getTags = () => {
    const tagSet = new Set<string>();
    
    if (oasDocument.tags) {
      oasDocument.tags.forEach((tag: any) => tagSet.add(tag.name));
    }
    
    // Also collect tags from operations
    if (oasDocument.paths) {
      Object.values(oasDocument.paths).forEach((pathItem: any) => {
        const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
        methods.forEach(method => {
          if (pathItem[method] && pathItem[method].tags) {
            pathItem[method].tags.forEach((tag: string) => tagSet.add(tag));
          }
        });
      });
    }
    
    return Array.from(tagSet);
  };
  
  // Count HTTP methods
  const countMethods = () => {
    const methodCounts: Record<string, number> = {
      get: 0,
      post: 0,
      put: 0,
      delete: 0,
      patch: 0,
      options: 0,
      head: 0
    };
    
    if (oasDocument.paths) {
      Object.values(oasDocument.paths).forEach((pathItem: any) => {
        Object.keys(methodCounts).forEach(method => {
          if (pathItem[method]) {
            methodCounts[method]++;
          }
        });
      });
    }
    
    return methodCounts;
  };
  
  // Get security schemes
  const getSecuritySchemes = () => {
    if (oasDocument.components?.securitySchemes) {
      return Object.entries(oasDocument.components.securitySchemes);
    }
    
    // For OpenAPI 2.0
    if (oasDocument.securityDefinitions) {
      return Object.entries(oasDocument.securityDefinitions);
    }
    
    return [];
  };
  
  // Extract server information
  const getServers = () => {
    if (oasDocument.servers && oasDocument.servers.length > 0) {
      return oasDocument.servers;
    }
    
    // For OpenAPI 2.0
    if (oasDocument.host) {
      const basePath = oasDocument.basePath || '';
      const schemes = oasDocument.schemes || ['https'];
      
      return schemes.map((scheme: string) => ({
        url: `${scheme}://${oasDocument.host}${basePath}`,
        description: 'Server inferred from OpenAPI 2.0 specification'
      }));
    }
    
    return [];
  };
  
  // Format number with commas for better readability
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Calculate path complexity (average operations per path)
  const calculatePathComplexity = (): { score: number, level: 'low' | 'medium' | 'high' } => {
    if (!oasDocument.paths || Object.keys(oasDocument.paths).length === 0) {
      return { score: 0, level: 'low' };
    }
    
    const paths = Object.keys(oasDocument.paths).length;
    const operations = validationResult.stats.endpoints;
    const score = operations / paths;
    
    let level: 'low' | 'medium' | 'high' = 'low';
    if (score >= 3) level = 'high';
    else if (score >= 1.5) level = 'medium';
    
    return { score: parseFloat(score.toFixed(1)), level };
  };
  
  const tags = getTags();
  const methodCounts = countMethods();
  const securitySchemes = getSecuritySchemes();
  const servers = getServers();
  const pathComplexity = calculatePathComplexity();
  
  // Calculate total paths
  const totalPaths = oasDocument.paths ? Object.keys(oasDocument.paths).length : 0;
  
  // Check if info has contact and license
  const hasContact = oasDocument.info?.contact && Object.keys(oasDocument.info.contact).length > 0;
  const hasLicense = oasDocument.info?.license && Object.keys(oasDocument.info.license).length > 0;
  
  // Check if API has deprecated endpoints
  const hasDeprecatedEndpoints = (() => {
    if (!oasDocument.paths) return false;
    
    for (const path of Object.values(oasDocument.paths) as any[]) {
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
      for (const method of methods) {
        if (path[method] && path[method].deprecated) {
          return true;
        }
      }
    }
    
    return false;
  })();
  
  return (
    <Box sx={{ mt: 2 }}>
      {/* Summary Cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              height: '100%',
              borderLeft: '4px solid',
              borderLeftColor: 'primary.main',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography color="text.secondary" variant="caption" component="div">
              ENDPOINTS
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ mt: 1 }}>
              {formatNumber(validationResult.stats.endpoints)}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 'auto', pt: 1 }}>
              Across {formatNumber(totalPaths)} paths
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              height: '100%',
              borderLeft: '4px solid',
              borderLeftColor: 'secondary.main',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography color="text.secondary" variant="caption" component="div">
              SCHEMAS
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ mt: 1 }}>
              {formatNumber(validationResult.stats.schemas)}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 'auto', pt: 1 }}>
              Data models & objects
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              height: '100%',
              borderLeft: '4px solid',
              borderLeftColor: 'success.main',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography color="text.secondary" variant="caption" component="div">
              TAGS
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ mt: 1 }}>
              {formatNumber(tags.length)}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 'auto', pt: 1 }}>
              Functional categories
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              height: '100%',
              borderLeft: '4px solid',
              borderLeftColor: 'info.main',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography color="text.secondary" variant="caption" component="div">
              COMPLEXITY
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ mt: 1 }}>
              {pathComplexity.score}
            </Typography>
            <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={pathComplexity.level} 
                size="small" 
                color={
                  pathComplexity.level === 'low' ? 'success' :
                  pathComplexity.level === 'medium' ? 'warning' : 'error'
                }
                sx={{ textTransform: 'capitalize' }}
              />
              <Typography color="text.secondary" variant="caption" sx={{ ml: 1 }}>
                Operations per path
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* HTTP Methods Distribution */}
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HubIcon fontSize="small" /> HTTP Methods Distribution
        </Typography>
        
        <Grid container spacing={1}>
          {Object.entries(methodCounts).map(([method, count]) => {
            if (count === 0) return null;
            
            const methodColor = 
              method === 'get' ? 'success.main' :
              method === 'post' ? 'primary.main' :
              method === 'put' ? 'warning.main' :
              method === 'delete' ? 'error.main' :
              method === 'patch' ? 'info.main' : 'text.disabled';
            
            // Calculate percentage
            const percentage = Math.round((count / validationResult.stats.endpoints) * 100);
            
            return (
              <Grid key={method} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      bgcolor: methodColor,
                      mr: 1
                    }} 
                  />
                  <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                    {method}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                    {count} ({percentage}%)
                  </Typography>
                </Box>
                
                <Box sx={{ height: 8, bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
                  <Box 
                    sx={{ 
                      height: '100%', 
                      width: `${percentage}%`, 
                      bgcolor: methodColor,
                      transition: 'width 1s ease-in-out'
                    }} 
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
      
      {/* API Details */}
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {/* API Metadata */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, mt: 1.5, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon fontSize="small" /> API Metadata
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">OpenAPI Version</Typography>
                <Chip 
                  label={validationResult.stats.version} 
                  size="small" 
                  color="primary"
                />
              </Box>
              
              {oasDocument.info?.title && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Title</Typography>
                  <Typography variant="body2" fontWeight="medium">{oasDocument.info.title}</Typography>
                </Box>
              )}
              
              {oasDocument.info?.version && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">API Version</Typography>
                  <Typography variant="body2">{oasDocument.info.version}</Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Contact Info</Typography>
                <Chip 
                  label={hasContact ? 'Available' : 'Not defined'} 
                  size="small" 
                  color={hasContact ? 'success' : 'default'}
                  variant={hasContact ? 'filled' : 'outlined'}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">License</Typography>
                <Chip 
                  label={hasLicense ? 'Available' : 'Not defined'} 
                  size="small" 
                  color={hasLicense ? 'success' : 'default'}
                  variant={hasLicense ? 'filled' : 'outlined'}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Deprecated Endpoints</Typography>
                <Chip 
                  label={hasDeprecatedEndpoints ? 'Present' : 'None'} 
                  size="small" 
                  color={hasDeprecatedEndpoints ? 'warning' : 'success'}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
        
        {/* Security */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, mt: 1.5, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon fontSize="small" /> Security & Servers
            </Typography>
            
            {securitySchemes.length > 0 ? (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Security Schemes ({securitySchemes.length})
                </Typography>
                <Stack spacing={1} sx={{ mb: 3 }}>
                  {securitySchemes.map(([name, scheme]: [string, any], index) => (
                    <Box 
                      key={name} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 1, 
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Chip 
                        label={scheme.type} 
                        size="small"
                        color={
                          scheme.type === 'oauth2' ? 'primary' :
                          scheme.type === 'apiKey' ? 'secondary' :
                          scheme.type === 'http' ? 'success' :
                          scheme.type === 'openIdConnect' ? 'info' : 'default'
                        }
                      />
                      <Typography variant="body2" sx={{ ml: 1.5, fontWeight: 'medium' }}>
                        {name}
                      </Typography>
                      {scheme.scheme && (
                        <Chip 
                          label={scheme.scheme} 
                          size="small" 
                          variant="outlined" 
                          sx={{ ml: 'auto' }}
                        />
                      )}
                    </Box>
                  ))}
                </Stack>
              </>
            ) : (
              <Alert severity="info" sx={{ mb: 2 }}>No security schemes defined</Alert>
            )}
            
            {/* Servers */}
            {servers.length > 0 ? (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Server Environments ({servers.length})
                </Typography>
                <Stack spacing={1}>
                  {servers.map((server: any, index: number) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LanguageIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            fontWeight: 'medium',
                            wordBreak: 'break-all'
                          }}
                        >
                          {server.url}
                        </Typography>
                      </Box>
                      {server.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {server.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </>
            ) : (
              <Alert severity="info">No servers defined</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const ValidationStep: React.FC<ValidationStepProps> = ({ 
  isValidating, 
  validationResult, 
  oasDocument,
  onValidate 
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Download the specification as a JSON file
  const handleDownloadSpec = () => {
    if (!oasDocument) return;
    
    const specString = JSON.stringify(oasDocument, null, 2);
    const blob = new Blob([specString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename from API info if available
    const filename = oasDocument.info?.title 
      ? `${oasDocument.info.title.toLowerCase().replace(/\s+/g, '-')}_v${oasDocument.info.version}.json`
      : 'openapi-spec.json';
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render endpoints table if we have the OAS document
  const renderEndpointsTable = () => {
    if (!oasDocument || !oasDocument.paths) {
      return <Alert severity="info">No endpoints defined in this API specification.</Alert>;
    }

    const paths = Object.keys(oasDocument.paths);
    
    if (paths.length === 0) {
      return <Alert severity="info">No endpoints defined in this API specification.</Alert>;
    }

    // Group endpoints by tags
    const endpointsByTag: Record<string, Array<{ path: string; method: string; operation: any }>> = {
      'default': [] // For endpoints without tags
    };
    
    // First, collect all tags and organize endpoints
    paths.forEach(path => {
      const pathItem = oasDocument.paths[path];
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
      
      methods.forEach(method => {
        if (pathItem[method]) {
          const operation = pathItem[method];
          const tags = operation.tags && operation.tags.length > 0 
            ? operation.tags 
            : ['default'];
          
          // Add endpoint to each of its tags
          tags.forEach((tag: string) => {
            if (!endpointsByTag[tag]) {
              endpointsByTag[tag] = [];
            }
            
            endpointsByTag[tag].push({
              path,
              method,
              operation
            });
          });
        }
      });
    });
    
    // Remove default tag if empty
    if (endpointsByTag['default'].length === 0) {
      delete endpointsByTag['default'];
    }
    
    // Check if we have any endpoints to display
    if (Object.keys(endpointsByTag).length === 0) {
      return (
        <Alert severity="warning">
          The specification contains paths but no valid endpoints with operations were found.
        </Alert>
      );
    }
    
    // Sort tags alphabetically but with 'default' at the end if it exists
    const sortedTags = Object.keys(endpointsByTag).sort((a, b) => {
      if (a === 'default') return 1;
      if (b === 'default') return -1;
      return a.localeCompare(b);
    });

    return (
      <Stack spacing={2}>
        {sortedTags.map(tag => (
          <Accordion key={tag} variant="outlined" defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                {tag === 'default' ? 'Uncategorized' : tag}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                ({endpointsByTag[tag].length} endpoints)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* Group by path within each tag */}
                {(() => {
                  // Group endpoints by path within this tag
                  const pathsInTag: Record<string, Array<{ method: string; operation: any }>> = {};
                  
                  endpointsByTag[tag].forEach(endpoint => {
                    if (!pathsInTag[endpoint.path]) {
                      pathsInTag[endpoint.path] = [];
                    }
                    pathsInTag[endpoint.path].push({
                      method: endpoint.method,
                      operation: endpoint.operation
                    });
                  });
                  
                  // Sort paths alphabetically
                  const sortedPaths = Object.keys(pathsInTag).sort();
                  
                  if (sortedPaths.length === 0) {
                    return (
                      <Alert severity="info">
                        No endpoints found in this tag.
                      </Alert>
                    );
                  }
                  
                  return sortedPaths.map(path => {
                    const endpointMethods = pathsInTag[path];
                    
                    return (
                      <Accordion key={path} variant="outlined" defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                            {path}
                          </Typography>
                          <Box sx={{ ml: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {endpointMethods.map(({ method }) => (
                              <Chip 
                                key={method}
                                label={method.toUpperCase()} 
                                size="small"
                                color={
                                  method === 'get' ? 'success' :
                                  method === 'post' ? 'primary' :
                                  method === 'put' ? 'warning' :
                                  method === 'delete' ? 'error' :
                                  method === 'patch' ? 'info' : 'default'
                                }
                              />
                            ))}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={2}>
                            {endpointMethods.map(({ method, operation }) => (
                              <Accordion 
                                key={method} 
                                variant="outlined"
                                disableGutters
                                defaultExpanded={false}
                                sx={{ 
                                  borderLeft: '4px solid',
                                  borderLeftColor: 
                                    method === 'get' ? 'success.main' :
                                    method === 'post' ? 'primary.main' :
                                    method === 'put' ? 'warning.main' :
                                    method === 'delete' ? 'error.main' :
                                    method === 'patch' ? 'info.main' : 'text.disabled'
                                }}
                              >
                                <AccordionSummary 
                                  expandIcon={<ExpandMoreIcon />}
                                  sx={{ py: 1 }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip 
                                      label={method.toUpperCase()} 
                                      color={
                                        method === 'get' ? 'success' :
                                        method === 'post' ? 'primary' :
                                        method === 'put' ? 'warning' :
                                        method === 'delete' ? 'error' :
                                        method === 'patch' ? 'info' : 'default'
                                      }
                                    />
                                    <Typography variant="subtitle1">
                                      {operation.summary || `${method.toUpperCase()} ${path}`}
                                    </Typography>
                                    {operation.deprecated && (
                                      <Chip label="Deprecated" color="error" size="small" />
                                    )}
                                  </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 2, py: 2 }}>
                                  {operation.description && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                      {operation.description}
                                    </Typography>
                                  )}
                                  
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    {operation.tags?.map((tagName: string) => (
                                      <Chip key={tagName} label={tagName} size="small" variant="outlined" />
                                    ))}
                                  </Box>
                                  
                                  <Stack spacing={2}>
                                    {/* Parameters */}
                                    {operation.parameters && operation.parameters.length > 0 ? (
                                      <Accordion variant="outlined" defaultExpanded={false}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                          <Typography variant="subtitle2">
                                            Parameters ({operation.parameters.length})
                                          </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                          <TableContainer component={Paper} variant="outlined">
                                            <Table size="small">
                                              <TableHead>
                                                <TableRow>
                                                  <TableCell>Name</TableCell>
                                                  <TableCell>In</TableCell>
                                                  <TableCell>Type</TableCell>
                                                  <TableCell>Required</TableCell>
                                                  <TableCell>Description</TableCell>
                                                </TableRow>
                                              </TableHead>
                                              <TableBody>
                                                {operation.parameters.map((param: any, idx: number) => (
                                                  <TableRow key={idx}>
                                                    <TableCell>{param.name}</TableCell>
                                                    <TableCell>
                                                      <Chip 
                                                        label={param.in} 
                                                        size="small" 
                                                        color={
                                                          param.in === 'path' ? 'primary' :
                                                          param.in === 'query' ? 'secondary' :
                                                          param.in === 'header' ? 'default' :
                                                          param.in === 'cookie' ? 'warning' : 'default'
                                                        }
                                                      />
                                                    </TableCell>
                                                    <TableCell>
                                                      {param.schema?.type || param.type || '-'}
                                                      {param.schema?.format && ` (${param.schema.format})`}
                                                    </TableCell>
                                                    <TableCell>{param.required ? 'Yes' : 'No'}</TableCell>
                                                    <TableCell>{param.description || '-'}</TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </TableContainer>
                                        </AccordionDetails>
                                      </Accordion>
                                    ) : null}
                                    
                                    {/* Request Body */}
                                    {operation.requestBody && (
                                      <Accordion variant="outlined" defaultExpanded={false}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                          <Typography variant="subtitle2">
                                            Request Body {operation.requestBody.required && <span>(Required)</span>}
                                          </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                          {operation.requestBody.description && (
                                            <Typography variant="body2" paragraph>
                                              {operation.requestBody.description}
                                            </Typography>
                                          )}
                                          
                                          {operation.requestBody.content && Object.keys(operation.requestBody.content).length > 0 ? (
                                            <Box>
                                              <Typography variant="subtitle2" gutterBottom>
                                                Content Types:
                                              </Typography>
                                              
                                              <Stack spacing={2}>
                                                {Object.entries(operation.requestBody.content).map(([contentType, contentDesc]: [string, any]) => (
                                                  <Box key={contentType}>
                                                    <Chip label={contentType} size="small" sx={{ mb: 1 }} />
                                                    
                                                    {contentDesc.schema ? (
                                                      <Box 
                                                        sx={{ 
                                                          p: 1, 
                                                          bgcolor: 'background.default',
                                                          borderRadius: 1,
                                                          maxHeight: '200px',
                                                          overflow: 'auto'
                                                        }}
                                                      >
                                                        <pre style={{ margin: 0, fontSize: '0.75rem' }}>
                                                          {JSON.stringify(contentDesc.schema, null, 2)}
                                                        </pre>
                                                      </Box>
                                                    ) : (
                                                      <Typography variant="body2" color="text.secondary">
                                                        No schema defined for this content type.
                                                      </Typography>
                                                    )}
                                                  </Box>
                                                ))}
                                              </Stack>
                                            </Box>
                                          ) : (
                                            <Alert severity="info">
                                              Request body is defined but no content types are specified.
                                            </Alert>
                                          )}
                                        </AccordionDetails>
                                      </Accordion>
                                    )}
                                    
                                    {/* Responses */}
                                    {operation.responses && Object.keys(operation.responses).length > 0 && (
                                      <Accordion variant="outlined" defaultExpanded={false}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                          <Typography variant="subtitle2">
                                            Responses ({Object.keys(operation.responses).length})
                                          </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                          <Stack spacing={1}>
                                            {Object.entries(operation.responses).map(([statusCode, response]: [string, any]) => (
                                              <Accordion key={statusCode} variant="outlined" defaultExpanded={false}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                  <Stack direction="row" spacing={2} alignItems="center">
                                                    <Chip 
                                                      label={statusCode} 
                                                      size="small"
                                                      color={
                                                        statusCode.startsWith('2') ? 'success' :
                                                        statusCode.startsWith('4') ? 'warning' :
                                                        statusCode.startsWith('5') ? 'error' : 'default'
                                                      }
                                                    />
                                                    <Typography variant="body2">
                                                      {response.description || 'No description'}
                                                    </Typography>
                                                  </Stack>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                  {response.content && Object.keys(response.content).length > 0 ? (
                                                    <Stack spacing={2}>
                                                      {Object.entries(response.content).map(([contentType, contentDesc]: [string, any]) => (
                                                        <Box key={contentType}>
                                                          <Typography variant="subtitle2" gutterBottom>
                                                            {contentType}:
                                                          </Typography>
                                                          {contentDesc.schema ? (
                                                            <Box 
                                                              sx={{ 
                                                                p: 1, 
                                                                bgcolor: 'background.default',
                                                                borderRadius: 1,
                                                                border: '1px solid',
                                                                borderColor: 'divider'
                                                              }}
                                                            >
                                                              <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto' }}>
                                                                {JSON.stringify(contentDesc.schema, null, 2)}
                                                              </pre>
                                                            </Box>
                                                          ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                              No schema defined for this content type.
                                                            </Typography>
                                                          )}
                                                        </Box>
                                                      ))}
                                                    </Stack>
                                                  ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                      This response does not define any content types. It may represent a no-content response 
                                                      or the specification may be incomplete.
                                                    </Typography>
                                                  )}
                                                </AccordionDetails>
                                              </Accordion>
                                            ))}
                                          </Stack>
                                        </AccordionDetails>
                                      </Accordion>
                                    )}
                                  </Stack>
                                </AccordionDetails>
                              </Accordion>
                            ))}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    );
                  });
                })()}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    );
  };

  // Render schemas table
  const renderSchemasTable = () => {
    if (!oasDocument) return null;
    
    // Different structure based on OpenAPI version
    const schemas = oasDocument.components?.schemas || oasDocument.definitions || {};
    const schemaEntries = Object.entries(schemas);

    if (schemaEntries.length === 0) {
      return <Alert severity="info">No schema definitions found in this API specification.</Alert>;
    }

    return (
      <Stack spacing={2}>
        {schemaEntries.map(([name, schema]: [string, any]) => (
          <SchemaViewer key={name} name={name} schema={schema} />
        ))}
      </Stack>
    );
  };

  // Render API info
  const renderApiInfo = () => {
    if (!oasDocument || !oasDocument.info) return null;

    const { info } = oasDocument;
    
    return (
      <Stack spacing={2}>
        <Typography variant="h6">{info.title || 'Untitled API'}</Typography>
        {info.description && (
          <Typography variant="body2" color="text.secondary">
            {info.description}
          </Typography>
        )}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {info.version && <Chip label={`Version: ${info.version}`} size="small" />}
          {oasDocument.openapi && <Chip label={`OpenAPI: ${oasDocument.openapi}`} size="small" color="primary" />}
          {oasDocument.swagger && <Chip label={`Swagger: ${oasDocument.swagger}`} size="small" color="primary" />}
        </Stack>
      </Stack>
    );
  };

  // Render raw JSON view
  const renderRawJson = () => {
    if (!oasDocument) return null;
    
    return (
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          bgcolor: 'background.paper',
          borderRadius: 1,
          maxHeight: '60vh',
          overflow: 'auto'
        }}
      >
        <pre style={{ margin: 0, fontSize: '0.75rem' }}>
          {JSON.stringify(oasDocument, null, 2)}
        </pre>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Validation & Publication
      </Typography>
      
      {isValidating ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
          <CircularProgress size={24} />
          <Alert severity="info">Validating API specification...</Alert>
        </Box>
      ) : validationResult ? (
        <Stack spacing={3}>
          <Alert 
            severity={validationResult.valid ? "success" : "warning"}
            variant="filled"
            icon={validationResult.valid ? <CheckCircleIcon /> : <ErrorIcon />}
          >
            {validationResult.valid 
              ? "API specification is valid and ready to publish!" 
              : "API specification has issues that need to be resolved."}
          </Alert>
          
          <Box>
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ApiIcon /> API Statistics
              </Typography>
              
              {oasDocument && (
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadSpec}
                  size="small"
                >
                  Download Specification
                </Button>
              )}
            </Stack>
            
            <ApiStatisticsPanel oasDocument={oasDocument} validationResult={validationResult} />
          </Box>
          
          {oasDocument && (
            <>
              <Divider />
              
              {renderApiInfo()}
              
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="API specification tabs">
                    <Tab 
                      icon={<ApiIcon />} 
                      label="Endpoints" 
                      id="validation-tab-0" 
                      aria-controls="validation-tabpanel-0" 
                    />
                    <Tab 
                      icon={<SchemaIcon />} 
                      label="Schemas" 
                      id="validation-tab-1" 
                      aria-controls="validation-tabpanel-1" 
                    />
                    <Tab 
                      icon={<HubIcon />}
                      label="Visualization" 
                      id="validation-tab-2" 
                      aria-controls="validation-tabpanel-2"
                    />
                    <Tab 
                      icon={<CompareArrowsIcon />}
                      label="Version Compare" 
                      id="validation-tab-3" 
                      aria-controls="validation-tabpanel-3"
                    />
                    <Tab 
                      icon={<CodeIcon />}
                      label="Raw JSON" 
                      id="validation-tab-4" 
                      aria-controls="validation-tabpanel-4"
                    />
                    {validationResult.errors.length > 0 && (
                      <Tab 
                        icon={<ErrorIcon />}
                        label={`Errors (${validationResult.errors.length})`} 
                        id="validation-tab-5" 
                        aria-controls="validation-tabpanel-5"
                        sx={{ color: 'error.main' }}
                      />
                    )}
                  </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                  {renderEndpointsTable()}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  {renderSchemasTable()}
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <EndpointsVisualization oasDocument={oasDocument} />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                  <ApiVersionComparison oasDocument={oasDocument} />
                </TabPanel>
                <TabPanel value={tabValue} index={4}>
                  {renderRawJson()}
                </TabPanel>
                {validationResult.errors.length > 0 && (
                  <TabPanel value={tabValue} index={5}>
                    <Stack spacing={1}>
                      {validationResult.errors.map((error, index) => (
                        <Alert key={index} severity="error" variant="outlined">
                          <Typography variant="body2">
                            <strong>{error.path}</strong>: {error.message}
                          </Typography>
                        </Alert>
                      ))}
                    </Stack>
                  </TabPanel>
                )}
              </Box>
            </>
          )}
          
          {!oasDocument && validationResult.errors.length > 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>Validation Issues</Typography>
              <Stack spacing={1}>
                {validationResult.errors.map((error, index) => (
                  <Alert key={index} severity="error">
                    <Typography variant="body2">
                      <strong>{error.path}</strong>: {error.message}
                    </Typography>
                  </Alert>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      ) : (
        <Stack spacing={2} alignItems="flex-start">
          <Alert severity="info">
            Click "Validate" to check your API specification.
          </Alert>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onValidate}
            startIcon={<PlayArrowIcon />}
          >
            Validate
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default ValidationStep; 