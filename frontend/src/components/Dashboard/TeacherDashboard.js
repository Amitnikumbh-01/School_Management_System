import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import {
  Class as ClassIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import DashboardCard from '../Common/DashboardCard';
import CreateClassDialog from '../Class/CreateClassDialog';
import CreateAssignmentDialog from '../Assignment/CreateAssignmentDialog';
import EditClassDialog from '../Class/EditClassDialog';
import EditAssignmentDialog from '../Assignment/EditAssignmentDialog';
import { createAssignment, getAssignments, updateAssignment } from '../../redux/slices/assignmentSlice';
import { getClasses, createClass, updateClass, deleteClass } from '../../redux/slices/classSlice';
import ManageStudents from '../Class/ManageStudents';
import AttendanceDialog from '../Attendance/AttendanceDialog';
import ManageStudentsDialog from '../Class/ManageStudentsDialog';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  welcomeMessage: {
    marginBottom: theme.spacing(4),
  },
  listItem: {
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
}));

const TeacherDashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { classes: classList, loading: classLoading } = useSelector((state) => state.class);
  const { assignments, loading: assignmentLoading } = useSelector((state) => state.assignment);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [selectedClassToEdit, setSelectedClassToEdit] = useState(null);
  const [selectedAssignmentToEdit, setSelectedAssignmentToEdit] = useState(null);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState(null);
  const [manageStudentsOpen, setManageStudentsOpen] = useState(false);

  useEffect(() => {
    dispatch(getClasses());
    dispatch(getAssignments());
  }, [dispatch]);

  const upcomingSchedule = [
    { id: 1, title: 'Class 10-A Mathematics', time: '9:00 AM - 10:00 AM' },
    { id: 2, title: 'Class 11-C Physics', time: '11:00 AM - 12:00 PM' },
  ];

  const recentActivities = [
    { id: 1, description: 'Posted new assignment for Class 10-A', time: '2 hours ago' },
    { id: 2, description: 'Updated attendance for Class 11-C', time: '4 hours ago' },
  ];

  const handleCreateClass = async (classData) => {
    try {
      await dispatch(createClass(classData)).unwrap();
      // Refresh classes list
      dispatch(getClasses());
      setIsClassDialogOpen(false); // Close dialog after successful creation
    } catch (error) {
      console.error('Failed to create class:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      await dispatch(createAssignment(assignmentData)).unwrap();
      setIsAssignmentDialogOpen(false);
      // Refresh assignments list
      dispatch(getAssignments());
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  const handleEditClass = async (updatedData) => {
    try {
      await dispatch(updateClass({ classId: selectedClassToEdit._id, ...updatedData })).unwrap();
      setSelectedClassToEdit(null);
      dispatch(getClasses());
    } catch (error) {
      console.error('Failed to update class:', error);
    }
  };

  const handleEditAssignment = async (updatedData) => {
    try {
      await dispatch(updateAssignment({ 
        assignmentId: selectedAssignmentToEdit._id, 
        ...updatedData 
      })).unwrap();
      setSelectedAssignmentToEdit(null);
      dispatch(getAssignments());
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  // Get today's schedule from classes
  const getTodaySchedule = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return classList
      .filter(cls => cls.schedule?.dayOfWeek === today)
      .map(cls => ({
        id: cls._id,
        title: `${cls.name} ${cls.subject}`,
        time: `${cls.schedule.startTime} - ${cls.schedule.endTime}`
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleManageStudents = (classData) => {
    setSelectedClassForStudents(classData);
    setManageStudentsOpen(true);
  };

  const handleMarkAttendance = (classData) => {
    setSelectedClassForAttendance(classData);
    setIsAttendanceDialogOpen(true);
  };

  const handleDeleteClick = (classId) => {
    setClassToDelete(classId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteClass(classToDelete)).unwrap();
      dispatch(getClasses());
      setDeleteConfirmOpen(false);
      setClassToDelete(null);
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.welcomeMessage} gutterBottom>
        Teacher Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Classes */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="My Classes">
            <List>
              {classList.map((class_) => (
                <ListItem key={class_._id} className={classes.listItem}>
                  <ListItemIcon>
                    <ClassIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={class_.name}
                    secondary={`${class_.subject} | ${class_.students?.length || 0} students`}
                  />
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setSelectedClassToEdit(class_)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleManageStudents(class_)}
                    style={{ marginRight: 8 }}
                  >
                    Manage Students
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleMarkAttendance(class_)}
                  >
                    Mark Attendance
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDeleteClick(class_._id)}
                  >
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className={classes.addButton}
              fullWidth
              onClick={() => setIsClassDialogOpen(true)}
            >
              Create New Class
            </Button>
          </DashboardCard>
        </Grid>

        {/* Assignments */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Active Assignments">
            <List>
              {assignments.map((assignment) => (
                <ListItem key={assignment._id} className={classes.listItem}>
                  <ListItemIcon>
                    <AssignmentIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={assignment.title}
                    secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                  />
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setSelectedAssignmentToEdit(assignment)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className={classes.addButton}
              fullWidth
              onClick={() => setIsAssignmentDialogOpen(true)}
            >
              Create Assignment
            </Button>
          </DashboardCard>
        </Grid>

        {/* Schedule */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Today's Schedule">
            <List>
              {getTodaySchedule().map((schedule) => (
                <ListItem key={schedule.id} className={classes.listItem}>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={schedule.title}
                    secondary={schedule.time}
                  />
                </ListItem>
              ))}
              {getTodaySchedule().length === 0 && (
                <ListItem>
                  <ListItemText primary="No classes scheduled for today" />
                </ListItem>
              )}
            </List>
          </DashboardCard>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Recent Activities">
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id} className={classes.listItem}>
                  <ListItemIcon>
                    <PeopleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </DashboardCard>
        </Grid>
      </Grid>

      <CreateClassDialog
        open={isClassDialogOpen}
        onClose={() => setIsClassDialogOpen(false)}
        onSubmit={handleCreateClass}
      />

      <CreateAssignmentDialog
        open={isAssignmentDialogOpen}
        onClose={() => setIsAssignmentDialogOpen(false)}
        onSubmit={handleCreateAssignment}
        classes={classList}
      />

      {selectedClass && (
        <ManageStudents
          open={isManageStudentsOpen}
          onClose={() => setIsManageStudentsOpen(false)}
          classData={selectedClass}
        />
      )}

      {selectedClassToEdit && (
        <EditClassDialog
          open={Boolean(selectedClassToEdit)}
          onClose={() => setSelectedClassToEdit(null)}
          onSubmit={handleEditClass}
          classData={selectedClassToEdit}
        />
      )}

      {selectedAssignmentToEdit && (
        <EditAssignmentDialog
          open={Boolean(selectedAssignmentToEdit)}
          onClose={() => setSelectedAssignmentToEdit(null)}
          onSubmit={handleEditAssignment}
          assignment={selectedAssignmentToEdit}
          classes={classList}
        />
      )}

      {selectedClassForAttendance && (
        <AttendanceDialog
          open={isAttendanceDialogOpen}
          onClose={() => {
            setIsAttendanceDialogOpen(false);
            setSelectedClassForAttendance(null);
          }}
          classData={selectedClassForAttendance}
        />
      )}

      {selectedClassForStudents && (
        <ManageStudentsDialog
          open={manageStudentsOpen}
          onClose={() => {
            setManageStudentsOpen(false);
            setSelectedClassForStudents(null);
          }}
          classData={selectedClassForStudents}
        />
      )}

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this class? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeacherDashboard; 