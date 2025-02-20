import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSubject } from '../../redux/slices/subjectSlice';
import {
  TextField,
  Button,
  Paper,
  Typography,
} from '@material-ui/core';

const SubjectForm = () => {
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [classId, setClassId] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSubject({ name, teacher: teacherId, class: classId }));
    setName('');
    setTeacherId('');
    setClassId('');
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>
        Add New Subject
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Subject Name"
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
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Add Subject
        </Button>
      </form>
    </Paper>
  );
};

export default SubjectForm; 