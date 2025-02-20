import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAttendance } from '../../redux/slices/attendanceSlice';
import {
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';

const AttendanceForm = () => {
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [status, setStatus] = useState('present');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(markAttendance({
      student: studentId,
      subject: subjectId,
      date,
      status,
    }));
    setStudentId('');
    setSubjectId('');
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>
        Mark Attendance
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Subject ID"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Mark Attendance
        </Button>
      </form>
    </Paper>
  );
};

export default AttendanceForm; 