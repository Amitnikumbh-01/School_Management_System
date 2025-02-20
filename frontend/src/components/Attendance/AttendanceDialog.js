import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { markAttendance, getAttendance } from '../../redux/slices/attendanceSlice';

const AttendanceDialog = ({ open, onClose, classData }) => {
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.attendance);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate that all students have attendance marked
      if (classData?.students?.length !== Object.keys(attendance).length) {
        setError('Please mark attendance for all students');
        return;
      }

      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        student: studentId,
        class: classData._id,
        date: new Date().toISOString(),
        status: status
      }));

      await dispatch(markAttendance(attendanceData)).unwrap();
      await dispatch(getAttendance()); // Refresh attendance data
      onClose();
      setAttendance({}); // Reset form
    } catch (error) {
      setError(error.message || 'Failed to mark attendance');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Mark Attendance - {classData?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Date: {new Date().toLocaleDateString()}
          </Typography>
          <List>
            {classData?.students?.map((student) => (
              <ListItem key={student._id}>
                <ListItemText primary={student.name} />
                <FormControl variant="outlined" size="small">
                  <Select
                    value={attendance[student._id] || ''}
                    onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                    displayEmpty
                    disabled={loading}
                  >
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="present">Present</MenuItem>
                    <MenuItem value="absent">Absent</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={loading || classData?.students?.length !== Object.keys(attendance).length}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AttendanceDialog; 