import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { submitAssignment, getAssignments } from '../../redux/slices/assignmentSlice';

const AssignmentSubmissionDialog = ({ open, onClose, assignment }) => {
  const [submission, setSubmission] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(submitAssignment({
        assignmentId: assignment._id,
        submission: submission
      })).unwrap();
      
      // Refresh assignments to update status
      await dispatch(getAssignments());
      
      onClose();
      setSubmission('');
    } catch (error) {
      setError(error.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Submit Assignment - {assignment?.title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Due Date: {new Date(assignment?.dueDate).toLocaleDateString()}
        </Typography>
        <TextField
          fullWidth
          label="Your Submission"
          multiline
          rows={6}
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          margin="normal"
          variant="outlined"
          error={!!error}
          helperText={error}
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={!submission.trim() || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentSubmissionDialog; 