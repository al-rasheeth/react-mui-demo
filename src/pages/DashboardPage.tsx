import { Typography, Box, Paper, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('navigation.dashboard')}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Component Demos
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/demos/form"
          >
            Form Components
          </Button>
        </Stack>
      </Box>
      
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Section 1
          </Typography>
          <Typography variant="body2">
            This is a sample dashboard section using Material-UI Stack and Paper components.
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Section 2
          </Typography>
          <Typography variant="body2">
            Another section demonstrating the responsive layout.
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

export default DashboardPage; 