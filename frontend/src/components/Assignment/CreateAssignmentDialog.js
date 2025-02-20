import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minWidth: 400,
    padding: theme.spacing(2),
  },
}));

const CreateAssignmentDialog = ({ open, onClose, onSubmit, classes }) => {
  const styles = useStyles();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    class: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '', dueDate: '', class: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Assignment</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={styles.form}>
          <TextField
            name="title"
            label="Assignment Title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel>Class</InputLabel>
            <Select
              name="class"
              value={formData.class}
              onChange={handleChange}
              label="Class"
            >
              {classes && classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.name} - {cls.subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            name="dueDate"
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            variant="contained"
            disabled={!formData.title || !formData.class || !formData.dueDate}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateAssignmentDialog; 