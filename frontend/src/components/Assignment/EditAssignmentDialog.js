import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  DialogContentText,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { updateAssignment, deleteAssignment, getAssignments } from '../../redux/slices/assignmentSlice';

const EditAssignmentDialog = ({ open, onClose, assignment, classes }) => {
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    class: assignment?.class?._id || '',
    dueDate: assignment?.dueDate?.split('T')[0] || '',
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateAssignment({
        assignmentId: assignment._id,
        ...formData
      })).unwrap();
      await dispatch(getAssignments()); // Refresh assignments
      onClose();
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteAssignment(assignment._id)).unwrap();
      await dispatch(getAssignments()); // Refresh assignments
      onClose();
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  if (confirmDelete) {
    return (
      <Dialog open={true} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this assignment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Assignment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Class</InputLabel>
                <Select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                >
                  {classes.map(cls => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.name} - {cls.subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(true)} color="secondary">
            Delete
          </Button>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAssignmentDialog; 