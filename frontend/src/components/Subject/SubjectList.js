import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjects } from '../../redux/slices/subjectSlice';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from '@material-ui/core';

const SubjectList = () => {
  const dispatch = useDispatch();
  const { subjects, loading, error } = useSelector((state) => state.subject);

  useEffect(() => {
    dispatch(getSubjects());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Subjects
      </Typography>
      <List>
        {subjects.map((subject) => (
          <ListItem key={subject._id}>
            <ListItemText
              primary={subject.name}
              secondary={`Teacher: ${subject.teacher.name} | Class: ${subject.class.name}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SubjectList; 