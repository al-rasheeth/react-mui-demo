import { Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        {t('common.notFound')}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        {t('navigation.home')}
      </Button>
    </Box>
  );
};

export default NotFoundPage; 