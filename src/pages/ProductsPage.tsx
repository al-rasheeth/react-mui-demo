import { Typography, Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Sample product data
const products = [
  { id: '1', name: 'Product 1' },
  { id: '2', name: 'Product 2' },
  { id: '3', name: 'Product 3' },
  { id: '4', name: 'Product 4' },
  { id: '5', name: 'Product 5' },
];

const ProductsPage = () => {
  const { t } = useTranslation();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('navigation.products')}
      </Typography>
      
      <List sx={{ bgcolor: 'background.paper' }}>
        {products.map((product) => (
          <ListItem key={product.id} disablePadding>
            <ListItemButton component={RouterLink} to={`/products/${product.id}`}>
              <ListItemText primary={product.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProductsPage; 