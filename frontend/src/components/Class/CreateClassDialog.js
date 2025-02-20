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
  Grid,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const CreateClassDialog = ({ open, onClose, onSubmit }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    schedule: {
      dayOfWeek: '',
      startTime: '',
      endTime: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('schedule.')) {
      const scheduleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [scheduleField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      subject: '',
      description: '',
      schedule: {
        dayOfWeek: '',
        startTime: '',
        endTime: '',
      },
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm" 
      fullWidth
      keepMounted
      disableEnforceFocus
    >
      <DialogTitle>Create New Class</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={classes.form}>
          <TextField
            name="name"
            label="Class Name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="subject"
            label="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Day of Week</InputLabel>
                <Select
                  name="schedule.dayOfWeek"
                  value={formData.schedule.dayOfWeek}
                  onChange={handleChange}
                  label="Day of Week"
                >
                  {DAYS_OF_WEEK.map(day => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="schedule.startTime"
                label="Start Time"
                type="time"
                value={formData.schedule.startTime}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="schedule.endTime"
                label="End Time"
                type="time"
                value={formData.schedule.endTime}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            color="primary"
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            variant="contained"
            disabled={!formData.name || !formData.subject || !formData.schedule.dayOfWeek || !formData.schedule.startTime || !formData.schedule.endTime}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateClassDialog; 