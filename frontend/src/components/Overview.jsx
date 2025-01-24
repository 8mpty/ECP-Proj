import React from "react";
import { Grid, Paper, Typography, Box, Card, CardContent } from "@mui/material";
import { Person, Email, CalendarToday } from "@mui/icons-material";

const Overview = ({ user }) => {
  const formatEmail = (email) => {
    return email ? email.split("@")[0] : "";
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Welcome back, {formatEmail(user.username)}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We're glad to see you again. Here's your dashboard overview.
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            height: "100%",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Person sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
              <Typography variant="h6" component="h2">
                Profile Info
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Username: {formatEmail(user.username)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            height: "100%",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Email sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
              <Typography variant="h6" component="h2">
                Contact
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Email: {user.email}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            height: "100%",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CalendarToday
                sx={{ color: "primary.main", mr: 1, fontSize: 28 }}
              />
              <Typography variant="h6" component="h2">
                Session
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Last Login: {new Date().toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Overview;
