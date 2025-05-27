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

interface EndpointDetailProps {
  path: string;
  method: string;
  operation: any;
}

const EndpointDetail: React.FC<EndpointDetailProps> = ({ path, method, operation }) => {
  const [detailTab, setDetailTab] = useState(0);

  const handleDetailTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setDetailTab(newValue);
  };

  // Format parameters table
  const renderParameters = () => {
    if (!operation.parameters || operation.parameters.length === 0) {
      return <Alert severity="info">No parameters defined for this endpoint.</Alert>;
    }

    return (
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
            {operation.parameters.map((param: any, index: number) => (
              <TableRow key={index}>
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
    );
  };

  // Format request body information
  const renderRequestBody = () => {
    if (!operation.requestBody) {
      return <Alert severity="info">No request body defined for this endpoint.</Alert>;
    }

    const content = operation.requestBody.content;
    if (!content) return null;

    return (
      <Stack spacing={2}>
        {operation.requestBody.description && (
          <Typography variant="body2" color="text.secondary">
            {operation.requestBody.description}
          </Typography>
        )}
        <Typography variant="subtitle2">
          Required: {operation.requestBody.required ? 'Yes' : 'No'}
        </Typography>
        <Box>
          <Typography variant="subtitle2" gutterBottom>Content Types:</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Object.keys(content).map((contentType) => (
              <Chip 
                key={contentType} 
                label={contentType} 
                size="small"
              />
            ))}
          </Stack>
        </Box>
        {Object.entries(content).map(([contentType, contentDesc]: [string, any]) => (
          <Box key={contentType}>
            <Typography variant="subtitle2" gutterBottom>
              Schema for {contentType}:
            </Typography>
            <Box 
              sx={{ 
                p: 1, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto' }}>
                {JSON.stringify(contentDesc.schema, null, 2)}
              </pre>
            </Box>
          </Box>
        ))}
      </Stack>
    );
  };

  // Format responses information
  const renderResponses = () => {
    if (!operation.responses) {
      return <Alert severity="info">No responses defined for this endpoint.</Alert>;
    }

    return (
      <Stack spacing={2}>
        {Object.entries(operation.responses).map(([statusCode, response]: [string, any]) => (
          <Accordion key={statusCode} variant="outlined">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={1} alignItems="center">
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
              {response.content ? (
                <Stack spacing={2}>
                  {Object.entries(response.content).map(([contentType, contentDesc]: [string, any]) => (
                    <Box key={contentType}>
                      <Typography variant="subtitle2" gutterBottom>
                        {contentType}:
                      </Typography>
                      {contentDesc.schema && (
                        <Box 
                          sx={{ 
                            p: 1, 
                            bgcolor: 'background.paper', 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto' }}>
                            {JSON.stringify(contentDesc.schema, null, 2)}
                          </pre>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2">No content type defined.</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    );
  };

  // Format security information
  const renderSecurity = () => {
    if (!operation.security || operation.security.length === 0) {
      return <Alert severity="info">No security requirements defined for this endpoint.</Alert>;
    }

    return (
      <Stack spacing={2}>
        {operation.security.map((requirement: any, index: number) => (
          <Paper key={index} variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              {Object.entries(requirement).map(([scheme, scopes]: [string, any]) => (
                <Box key={scheme}>
                  <Typography variant="subtitle2">{scheme}</Typography>
                  {scopes && scopes.length > 0 && (
                    <Box>
                      <Typography variant="body2" gutterBottom>Required scopes:</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {scopes.map((scope: string) => (
                          <Chip key={scope} label={scope} size="small" />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={method} size="small" color={
            method === 'GET' ? 'success' :
            method === 'POST' ? 'primary' :
            method === 'PUT' ? 'warning' :
            method === 'DELETE' ? 'error' : 'default'
          } />
          {path}
        </Typography>
        
        {operation.summary && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {operation.summary}
          </Typography>
        )}
        
        {operation.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {operation.description}
          </Typography>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={detailTab} onChange={handleDetailTabChange} aria-label="endpoint details tabs">
            <Tab icon={<InfoIcon />} label="Parameters" id="endpoint-tab-0" />
            <Tab icon={<JsonIcon />} label="Request" id="endpoint-tab-1" />
            <Tab icon={<TerminalIcon />} label="Responses" id="endpoint-tab-2" />
            <Tab icon={<SecurityIcon />} label="Security" id="endpoint-tab-3" />
          </Tabs>
        </Box>
        
        <TabPanel value={detailTab} index={0}>
          {renderParameters()}
        </TabPanel>
        <TabPanel value={detailTab} index={1}>
          {renderRequestBody()}
        </TabPanel>
        <TabPanel value={detailTab} index={2}>
          {renderResponses()}
        </TabPanel>
        <TabPanel value={detailTab} index={3}>
          {renderSecurity()}
        </TabPanel>
      </Paper>
    </Box>
  );
};

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

const ValidationStep: React.FC<ValidationStepProps> = ({ 
  isValidating, 
  validationResult, 
  oasDocument,
  onValidate 
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedEndpoint, setSelectedEndpoint] = useState<{ path: string; method: string } | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Reset selected endpoint when changing tabs
    if (newValue !== 0) {
      setSelectedEndpoint(null);
    }
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
    if (!oasDocument || !oasDocument.paths) return null;

    const endpoints: Array<{path: string; method: string; summary: string; operationId?: string}> = [];
    
    // Extract all endpoints
    Object.entries(oasDocument.paths).forEach(([path, pathItem]: [string, any]) => {
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
      methods.forEach(method => {
        if (pathItem[method]) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            summary: pathItem[method].summary || '-',
            operationId: pathItem[method].operationId
          });
        }
      });
    });

    return (
      <Box>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Method</TableCell>
                <TableCell>Path</TableCell>
                <TableCell>Operation ID</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {endpoints.map((endpoint, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip 
                      label={endpoint.method} 
                      size="small"
                      color={
                        endpoint.method === 'GET' ? 'success' :
                        endpoint.method === 'POST' ? 'primary' :
                        endpoint.method === 'PUT' ? 'warning' :
                        endpoint.method === 'DELETE' ? 'error' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>{endpoint.path}</TableCell>
                  <TableCell>{endpoint.operationId || '-'}</TableCell>
                  <TableCell>{endpoint.summary}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined"
                      startIcon={<DescriptionIcon />}
                      onClick={() => setSelectedEndpoint({ 
                        path: endpoint.path, 
                        method: endpoint.method.toLowerCase() 
                      })}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {endpoints.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No endpoints defined</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {selectedEndpoint && oasDocument.paths[selectedEndpoint.path] && (
          <EndpointDetail 
            path={selectedEndpoint.path}
            method={selectedEndpoint.method}
            operation={oasDocument.paths[selectedEndpoint.path][selectedEndpoint.method.toLowerCase()]}
          />
        )}
      </Box>
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
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
              <Chip label={`${validationResult.stats.endpoints} Endpoints`} color="primary" />
              <Chip label={`${validationResult.stats.schemas} Schemas`} color="primary" />
              <Chip label={`OAS ${validationResult.stats.version}`} color="primary" />
            </Stack>
          </Box>
          
          {oasDocument && (
            <>
              <Divider />
              
              {renderApiInfo()}
              
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="API specification tabs">
                    <Tab label="Endpoints" id="validation-tab-0" aria-controls="validation-tabpanel-0" />
                    <Tab label="Schemas" id="validation-tab-1" aria-controls="validation-tabpanel-1" />
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