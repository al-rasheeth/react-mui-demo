import { Box, AppBar, Toolbar, Typography, IconButton, Container } from '@mui/material';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStore from '@store/useStore';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const MainLayout = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useStore();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('common.welcome')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
              {t('navigation.home')}
            </Typography>
            <Typography component={RouterLink} to="/about" color="inherit" sx={{ textDecoration: 'none' }}>
              {t('navigation.about')}
            </Typography>
            <Typography component={RouterLink} to="/dashboard" color="inherit" sx={{ textDecoration: 'none' }}>
              {t('navigation.dashboard')}
            </Typography>
          </Box>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout; 