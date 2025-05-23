import { Container, Box, Typography } from '@mui/material';
import { BasicExampleForm } from '../../components/examples/BasicExampleForm';

const FormDemo = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Form Components Demo
        </Typography>
        <Typography variant="body1" paragraph>
          This demo showcases the form components built with Material UI and React Hook Form.
          The components support both RHF mode and standalone mode.
        </Typography>
        <BasicExampleForm />
      </Box>
    </Container>
  );
};

export default FormDemo; 