import { Typography, Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Sample service data
const services = [
  { id: '1', name: 'Service 1' },
  { id: '2', name: 'Service 2' },
  { id: '3', name: 'Service 3' },
  { id: '4', name: 'Service 4' },
  { id: '5', name: 'Service 5' },
];

const ServicesPage = () => {
  const { t } = useTranslation();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('navigation.services')}
      </Typography>
      
      <List sx={{ bgcolor: 'background.paper' }}>
        {services.map((service) => (
          <ListItem key={service.id} disablePadding>
            <ListItemButton component={RouterLink} to={`/services/${service.id}`}>
              <ListItemText primary={service.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ServicesPage; 