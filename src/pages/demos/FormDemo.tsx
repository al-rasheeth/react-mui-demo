import { useState } from 'react';
import { Container, Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { BasicExampleForm } from '../../components/examples/BasicExampleForm';
import { NonRHFExample } from '../../components/examples/NonRHFExample';
import { ValidationExample } from '../../components/examples/ValidationExample';
import { CustomFieldsExample } from '../../components/examples/CustomFieldsExample';
import { AdvancedEditorsExample } from '../../components/examples/AdvancedEditorsExample';
import { FormLayoutsExample } from '../../components/examples/FormLayoutsExample';
import { FormStepperExample } from '../../components/examples/FormStepperExample';

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
      id={`form-tabpanel-${index}`}
      aria-labelledby={`form-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const FormDemo = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Form Components Demo
        </Typography>
        <Typography variant="body1" paragraph>
          This demo showcases different ways to use the form components built with Material UI and React Hook Form.
        </Typography>

        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Basic Example" />
            <Tab label="Non-RHF Mode" />
            <Tab label="Advanced Validation" />
            <Tab label="Custom Fields" />
            <Tab label="Advanced Editors" />
            <Tab label="Form Layouts" />
            <Tab label="Form Stepper" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Basic Form with React Hook Form
          </Typography>
          <Typography variant="body2" paragraph>
            A complete example showing all form components with React Hook Form integration.
          </Typography>
          <BasicExampleForm />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Form Components without React Hook Form
          </Typography>
          <Typography variant="body2" paragraph>
            Using the same components without React Hook Form integration by setting rhfMode={false}.
          </Typography>
          <NonRHFExample />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Advanced Form Validation
          </Typography>
          <Typography variant="body2" paragraph>
            Demonstrating complex validation rules, dependent fields, and custom error messages.
          </Typography>
          <ValidationExample />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Custom Form Fields
          </Typography>
          <Typography variant="body2" paragraph>
            Creating and using custom form fields with the base FormField component.
          </Typography>
          <CustomFieldsExample />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography variant="h5" gutterBottom>
            Advanced Editors
          </Typography>
          <Typography variant="body2" paragraph>
            Showcasing code editors, markdown editors, and file upload components.
          </Typography>
          <AdvancedEditorsExample />
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <Typography variant="h5" gutterBottom>
            Form Layouts
          </Typography>
          <Typography variant="body2" paragraph>
            Different layout options for forms: columns, cards, steppers, and more.
          </Typography>
          <FormLayoutsExample />
        </TabPanel>

        <TabPanel value={tabValue} index={6}>
          <Typography variant="h5" gutterBottom>
            Form Stepper
          </Typography>
          <Typography variant="body2" paragraph>
            A reusable form stepper component for multi-step forms with validation and customization options.
          </Typography>
          <FormStepperExample />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default FormDemo; 