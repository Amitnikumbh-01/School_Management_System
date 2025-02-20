import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
} from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addStudent, removeStudent, getClasses } from '../../redux/slices/classSlice';

const ManageStudentsDialog = ({ open, onClose, classData }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.class);

  const handleAddStudent = async () => {
    try {
      await dispatch(addStudent({ 
        classId: classData._id, 
        email 
      })).unwrap();
      await dispatch(getClasses()); // Refresh class data
      setEmail('');
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
        <div style={{ marginBottom: 20 }}>
          <TextField
            fullWidth
            label="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            size="small"
            error={!!error}
            helperText={error}
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddStudent}
            disabled={!email.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            style={{ marginTop: 10 }}
          >
            Add Student
          </Button>
        </div>
        
        <Divider style={{ margin: '20px 0' }} />
        
        <Typography variant="h6" gutterBottom>
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
                  disabled={loading}
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

export default ManageStudentsDialog; 