import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles,
  Paper,
  CircularProgress,
  Button,
} from '@material-ui/core';
import {
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Event as EventIcon,
} from '@material-ui/icons';
import DashboardCard from '../Common/DashboardCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignments } from '../../redux/slices/assignmentSlice';
import { getClasses } from '../../redux/slices/classSlice';
import { getAttendance } from '../../redux/slices/attendanceSlice';
import AssignmentSubmissionDialog from '../Assignment/AssignmentSubmissionDialog';
import { green } from '@material-ui/core/colors';

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
  assignmentTitle: {
    fontWeight: 'bold',
  },
  dueDate: {
    color: theme.palette.error.main,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  submittedButton: {
    backgroundColor: green[500],
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}));

const StudentDashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { assignments, loading: assignmentLoading } = useSelector((state) => state.assignment);
  const { classes: courseList, loading: classLoading } = useSelector((state) => state.class);
  const { userInfo } = useSelector((state) => state.auth);
  const { attendance } = useSelector((state) => state.attendance);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  
  useEffect(() => {
    dispatch(getClasses());
    dispatch(getAssignments());
    dispatch(getAttendance());
  }, [dispatch]);

  // Format date to a readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Sort assignments by due date
  const sortedAssignments = [...assignments].sort((a, b) => 
    new Date(a.dueDate) - new Date(b.dueDate)
  );

  const getAttendanceDetails = (classId) => {
    const classAttendance = attendance.filter(a => a.class === classId);
    const total = classAttendance.length;
    const present = classAttendance.filter(a => a.status === 'present').length;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
    
    return {
      total,
      present,
      absent: total - present,
      percentage
    };
  };

  if (classLoading || assignmentLoading) {
    return (
      <Container className={classes.container}>
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.welcomeMessage} gutterBottom>
        Welcome, {userInfo?.name}
      </Typography>
      
      <Grid container spacing={4}>
        {/* Enrolled Courses */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="My Courses">
            <List>
              {courseList.map((course) => (
                <ListItem key={course._id} className={classes.listItem}>
                  <ListItemIcon>
                    <ClassIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={course.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Teacher: {course.teacher.name}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Schedule: {course.schedule?.dayOfWeek} {course.schedule?.startTime}-{course.schedule?.endTime}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
              {courseList.length === 0 && (
                <ListItem>
                  <ListItemText 
                    primary="No courses enrolled"
                    secondary="Please contact your teacher to be added to a class"
                  />
                </ListItem>
              )}
            </List>
          </DashboardCard>
        </Grid>

        {/* Active Assignments */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Active Assignments">
            <List>
              {sortedAssignments.map((assignment) => (
                <ListItem key={assignment._id} className={classes.listItem}>
                  <ListItemIcon>
                    <AssignmentIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" className={classes.assignmentTitle}>
                        {assignment.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Due: {formatDate(assignment.dueDate)}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {assignment.description}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">
                          Class: {assignment.class?.name}
                        </Typography>
                      </>
                    }
                  />
                  <Button
                    variant="contained"
                    color={assignment.submissions?.length > 0 ? "default" : "primary"}
                    className={assignment.submissions?.length > 0 ? classes.submittedButton : ''}
                    onClick={() => {
                      if (!assignment.submissions?.length) {
                        setSelectedAssignment(assignment);
                        setSubmissionDialogOpen(true);
                      }
                    }}
                    disabled={new Date(assignment.dueDate) < new Date()}
                  >
                    {assignment.submissions?.length > 0 ? 'Submitted' : 'Submit'}
                  </Button>
                </ListItem>
              ))}
              {sortedAssignments.length === 0 && (
                <ListItem>
                  <ListItemText 
                    primary="No active assignments"
                    secondary="You're all caught up!"
                  />
                </ListItem>
              )}
            </List>
          </DashboardCard>
        </Grid>

        {/* Attendance Overview */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Attendance Overview">
            <List>
              {courseList.map((course) => {
                const stats = getAttendanceDetails(course._id);
                const attendanceColor = stats.percentage >= 75 ? '#4caf50' : '#f44336';
                
                return (
                  <ListItem key={course._id} className={classes.listItem}>
                    <ListItemIcon>
                      <TimelineIcon style={{ color: attendanceColor }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {course.name} - {course.subject}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" style={{ color: attendanceColor }}>
                            Attendance: {stats.percentage}%
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Present: {stats.present} | Absent: {stats.absent} | Total Classes: {stats.total}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="textSecondary">
                            Schedule: {course.schedule?.dayOfWeek} at {course.schedule?.startTime}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
              {courseList.length === 0 && (
                <ListItem>
                  <ListItemText primary="No courses enrolled" />
                </ListItem>
              )}
            </List>
          </DashboardCard>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Upcoming Events">
            <List>
              {courseList.map((course) => (
                <ListItem key={course._id} className={classes.listItem}>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${course.name} - Next Class`}
                    secondary={`${course.schedule?.dayOfWeek} at ${course.schedule?.startTime}`}
                  />
                </ListItem>
              ))}
              {courseList.length === 0 && (
                <ListItem>
                  <ListItemText primary="No upcoming events" />
                </ListItem>
              )}
            </List>
          </DashboardCard>
        </Grid>
      </Grid>
      {selectedAssignment && (
        <AssignmentSubmissionDialog
          open={submissionDialogOpen}
          onClose={() => {
            setSubmissionDialogOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
        />
      )}
    </Container>
  );
};

export default StudentDashboard; 