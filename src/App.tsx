import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { BasicExampleForm } from './components/examples/BasicExampleForm';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <BasicExampleForm />
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default App;
