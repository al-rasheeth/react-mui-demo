import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('navigation.about')}
      </Typography>
      <Typography variant="body1">
        This page demonstrates the routing capabilities and internationalization features.
      </Typography>
    </Box>
  );
};

export default AboutPage; 