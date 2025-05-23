import { Typography, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Mock API function - replace with real API calls in production
const fetchServiceDetails = async (serviceId: string) => {
  // In a real app, this would be an actual API call
  // return axios.get(`/api/services/${serviceId}`).then(res => res.data);
  
  // Simulating API response delay
  return new Promise<{ id: string; name: string; description: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        id: serviceId,
        name: `Service ${serviceId}`,
        description: `This is the detailed description of service ${serviceId}.`
      });
    }, 500);
  });
};

const ServicePage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => fetchServiceDetails(serviceId!),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !service) {
    return (
      <Box>
        <Typography variant="h4" color="error">
          Error loading service
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {service.name}
      </Typography>
      <Typography variant="body1">
        {service.description}
      </Typography>
    </Box>
  );
};

export default ServicePage; 