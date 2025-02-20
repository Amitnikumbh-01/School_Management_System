import React from 'react';
import { Container, Typography, Paper } from '@material-ui/core';

const AdminDashboard = () => {
  return (
    <Container>
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to the admin dashboard. Here you can manage users, classes, and more.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 