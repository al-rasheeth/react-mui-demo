import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('common.welcome')}
      </Typography>
      <Typography variant="body1">
        This is a modern React application built with Vite, Material-UI, React Router, i18n, and Zustand.
      </Typography>
    </Box>
  );
};

export default HomePage; 