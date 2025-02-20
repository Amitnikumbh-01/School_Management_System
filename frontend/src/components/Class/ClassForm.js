import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createClass } from '../../redux/slices/classSlice';
import {
  TextField,
  Button,
  Paper,
  Typography,
} from '@material-ui/core';

const ClassForm = () => {
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createClass({ name, teacher: teacherId }));
    setName('');
    setTeacherId('');
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>
        Add New Class
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Class Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Teacher ID"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Add Class
        </Button>
      </form>
    </Paper>
  );
};

export default ClassForm; 