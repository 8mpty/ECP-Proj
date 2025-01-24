import React, { useState } from 'react';
import { Box, Container } from "@mui/material";
import Dashboard from "../components/Dashboard";
import Overview from "../components/Overview";
import DocumentManagement from "../components/DocumentManagement";

const DashboardPage = ({ user, onLogout }) => {
  const [selectedView, setSelectedView] = useState("overview");

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dashboard 
        user={user} 
        onLogout={onLogout}
        currentView={selectedView}
        onViewChange={handleViewChange}
      />
      <Container
        maxWidth={false}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          flexGrow: 1,
          width: "100%",
        }}
      >
        {selectedView === 'overview' ? (
          <Overview user={user} />
        ) : (
          <DocumentManagement />
        )}
      </Container>
    </Box>
  );
};

export default DashboardPage;