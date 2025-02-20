import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { login, clearError } from '../../redux/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
    
    // If already logged in, redirect to appropriate dashboard
    if (userInfo) {
      switch (userInfo.role) {
        case 'admin':
          history.push('/admin');
          break;
        case 'teacher':
          history.push('/teacher');
          break;
        case 'student':
          history.push('/student');
          break;
        default:
          break;
      }
    }
  }, [dispatch, userInfo, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    try {
      const result = await dispatch(login({ email, password }));
      console.log('Login result:', result);
      if (login.fulfilled.match(result)) {
        // Redirect will happen in useEffect
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            style={{ marginTop: 16 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={() => history.push('/')}
            style={{ marginTop: 8 }}
          >
            Don't have an account? Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login; 