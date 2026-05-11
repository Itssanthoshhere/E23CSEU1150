import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { 
  ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, 
  Container, Button, IconButton, Badge, Tab, Tabs
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import theme from './theme';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';

function App() {
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem('viewedNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  const markAsViewed = (id) => {
    if (!viewedIds.includes(id)) {
      const updated = [...viewedIds, id];
      setViewedIds(updated);
      localStorage.setItem('viewedNotifications', JSON.stringify(updated));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar>
              <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                Campus Notifications
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  component={RouterLink} 
                  to="/" 
                  color="inherit"
                  startIcon={<NotificationsIcon />}
                >
                  All
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/priority" 
                  variant="contained" 
                  color="primary"
                  startIcon={<PriorityHighIcon />}
                >
                  Priority Inbox
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={<AllNotifications viewedIds={viewedIds} markAsViewed={markAsViewed} />} />
              <Route path="/priority" element={<PriorityInbox viewedIds={viewedIds} markAsViewed={markAsViewed} />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
