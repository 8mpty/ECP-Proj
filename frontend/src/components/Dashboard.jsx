import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import { 
  LogoutOutlined, 
  DashboardOutlined,
  Description as DocumentIcon
} from '@mui/icons-material';
import { signOut } from 'aws-amplify/auth';

const Dashboard = ({ user, onLogout, onViewChange, currentView }) => {
  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('user');
      onLogout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  const formatEmail = (email) => {
    return email ? email.split('@')[0] : '';
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        <Box sx={{ ml: 4, flexGrow: 1 }}>
          <Tabs 
            value={currentView} 
            onChange={(e, newValue) => onViewChange(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab 
              value="overview" 
              label="Overview" 
              icon={<DashboardOutlined />} 
              iconPosition="start"
            />
            <Tab 
              value="documents" 
              label="Document Management" 
              icon={<DocumentIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              textTransform: 'uppercase'
            }}
          >
            {user?.email?.charAt(0)}
          </Avatar>
          <Button 
            color="primary" 
            onClick={handleLogout}
            startIcon={<LogoutOutlined />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Dashboard;