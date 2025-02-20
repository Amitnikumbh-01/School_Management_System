import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { addStudent, removeStudent, getClasses } from '../../redux/slices/classSlice';

const ManageStudents = ({ open, onClose, classData }) => {
  const [studentEmail, setStudentEmail] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addStudent({ 
        classId: classData._id, 
        email: studentEmail 
      })).unwrap();
      await dispatch(getClasses()); // Refresh class data
      setStudentEmail('');
      setError('');
    } catch (error) {
      setError(error.message || 'Failed to add student');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await dispatch(removeStudent({ 
        classId: classData._id, 
        studentId 
      })).unwrap();
      await dispatch(getClasses()); // Refresh class data
    } catch (error) {
      setError(error.message || 'Failed to remove student');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Students - {classData?.name}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleAddStudent}>
          <TextField
            fullWidth
            label="Student Email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            error={!!error}
            helperText={error}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!studentEmail.trim()}
          >
            Add Student
          </Button>
        </form>

        <Typography variant="h6" style={{ marginTop: 20 }}>
          Enrolled Students ({classData?.students?.length || 0})
        </Typography>
        <List>
          {classData?.students?.map((student) => (
            <ListItem key={student._id}>
              <ListItemText
                primary={student.name}
                secondary={student.email}
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  onClick={() => handleRemoveStudent(student._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {classData?.students?.length === 0 && (
            <ListItem>
              <ListItemText primary="No students enrolled" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageStudents; 