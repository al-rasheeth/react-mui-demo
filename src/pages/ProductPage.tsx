import { Typography, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Mock API function - replace with real API calls in production
const fetchProductDetails = async (productId: string) => {
  // In a real app, this would be an actual API call
  // return axios.get(`/api/products/${productId}`).then(res => res.data);
  
  // Simulating API response delay
  return new Promise<{ id: string; name: string; description: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        id: productId,
        name: `Product ${productId}`,
        description: `This is the detailed description of product ${productId}.`
      });
    }, 500);
  });
};

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductDetails(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !product) {
    return (
      <Box>
        <Typography variant="h4" color="error">
          Error loading product
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="body1">
        {product.description}
      </Typography>
    </Box>
  );
};

export default ProductPage; 