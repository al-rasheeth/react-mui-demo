import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { router } from '@config/router';
import useStore from '@store/useStore';
import '@config/i18n';

function App() {
  const { theme } = useStore();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
