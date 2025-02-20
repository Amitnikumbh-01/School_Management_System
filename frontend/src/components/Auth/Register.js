import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@material-ui/core';
import { register } from '../../redux/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // default role
  });

  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    try {
      const result = await dispatch(register(formData));
      console.log('Registration result:', result);
      if (result.meta.requestStatus === 'fulfilled') {
        history.push('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper style={{ padding: 20, marginTop: 64 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
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
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            style={{ marginTop: 16 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={() => history.push('/login')}
            style={{ marginTop: 8 }}
          >
            Already have an account? Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register; 