import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchemaIcon from '@mui/icons-material/Schema';

interface SchemaViewerProps {
  schema: any;
  name: string;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ schema, name }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderSchemaProperties = (properties: any, required: string[] = []) => {
    if (!properties) return null;

    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Required</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(properties).map(([propName, propSchema]: [string, any]) => (
              <TableRow key={propName}>
                <TableCell>{propName}</TableCell>
                <TableCell>
                  <Chip 
                    label={propSchema.type || (propSchema.enum ? 'enum' : 'object')} 
                    size="small" 
                    color={
                      propSchema.type === 'string' ? 'primary' :
                      propSchema.type === 'number' || propSchema.type === 'integer' ? 'secondary' :
                      propSchema.type === 'boolean' ? 'default' :
                      propSchema.type === 'array' ? 'info' : 'default'
                    }
                  />
                  {propSchema.enum && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        Enum: [{propSchema.enum.join(', ')}]
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>{propSchema.format || '-'}</TableCell>
                <TableCell>
                  {required && required.includes(propName) ? 'Yes' : 'No'}
                </TableCell>
                <TableCell>{propSchema.description || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderObjectSchema = (schema: any, name: string) => {
    return (
      <Box>
        {schema.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {schema.description}
          </Typography>
        )}
        
        {schema.properties && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Properties
            </Typography>
            {renderSchemaProperties(schema.properties, schema.required)}
          </Box>
        )}
        
        {schema.allOf && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              All Of
            </Typography>
            <Stack spacing={2}>
              {schema.allOf.map((subSchema: any, index: number) => (
                <Paper key={index} variant="outlined" sx={{ p: 1 }}>
                  {subSchema.properties && renderSchemaProperties(subSchema.properties, subSchema.required)}
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
        
        {schema.oneOf && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              One Of
            </Typography>
            <Stack spacing={2}>
              {schema.oneOf.map((subSchema: any, index: number) => (
                <Paper key={index} variant="outlined" sx={{ p: 1 }}>
                  {subSchema.properties && renderSchemaProperties(subSchema.properties, subSchema.required)}
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    );
  };

  const renderArraySchema = (schema: any) => {
    return (
      <Box>
        {schema.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {schema.description}
          </Typography>
        )}
        
        <Typography variant="subtitle2" gutterBottom>
          Items
        </Typography>
        
        {schema.items && schema.items.type === 'object' && schema.items.properties ? (
          renderSchemaProperties(schema.items.properties, schema.items.required)
        ) : schema.items ? (
          <Typography variant="body2">
            Type: {schema.items.type || 'any'}
            {schema.items.format && ` (${schema.items.format})`}
          </Typography>
        ) : (
          <Typography variant="body2">No item schema defined</Typography>
        )}
      </Box>
    );
  };

  const renderPrimitiveSchema = (schema: any) => {
    return (
      <Box>
        {schema.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {schema.description}
          </Typography>
        )}
        
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2">Type: {schema.type}</Typography>
            {schema.format && (
              <Typography variant="body2">Format: {schema.format}</Typography>
            )}
          </Box>
          
          {schema.enum && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Enum Values:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {schema.enum.map((value: any, index: number) => (
                  <Chip key={index} label={value} size="small" />
                ))}
              </Stack>
            </Box>
          )}
          
          {(schema.minimum !== undefined || schema.maximum !== undefined) && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Constraints:
              </Typography>
              <Stack spacing={1}>
                {schema.minimum !== undefined && (
                  <Typography variant="body2">
                    Minimum: {schema.minimum}{schema.exclusiveMinimum ? ' (exclusive)' : ''}
                  </Typography>
                )}
                {schema.maximum !== undefined && (
                  <Typography variant="body2">
                    Maximum: {schema.maximum}{schema.exclusiveMaximum ? ' (exclusive)' : ''}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
          
          {schema.pattern && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Pattern:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {schema.pattern}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    );
  };

  const renderSchemaContent = () => {
    if (!schema) return null;
    
    if (schema.type === 'object' || schema.properties || schema.allOf || schema.oneOf) {
      return renderObjectSchema(schema, name);
    } else if (schema.type === 'array') {
      return renderArraySchema(schema);
    } else if (schema.type) {
      return renderPrimitiveSchema(schema);
    } else {
      // If no type is specified, default to object
      return renderObjectSchema(schema, name);
    }
  };

  return (
    <Accordion
      expanded={expanded === name}
      onChange={handleChange(name)}
      variant="outlined"
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchemaIcon color="primary" />
          <Typography variant="subtitle1">{name}</Typography>
          <Chip 
            label={schema.type || 'object'} 
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {renderSchemaContent()}
      </AccordionDetails>
    </Accordion>
  );
};

export default SchemaViewer; 