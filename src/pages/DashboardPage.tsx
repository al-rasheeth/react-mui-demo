import { Typography, Box, Paper, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('navigation.dashboard')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Section 1
            </Typography>
            <Typography variant="body2">
              This is a sample dashboard section using Material-UI Grid and Paper components.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Section 2
            </Typography>
            <Typography variant="body2">
              Another section demonstrating the responsive grid layout.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 