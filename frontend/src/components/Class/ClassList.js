import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClasses } from '../../redux/slices/classSlice';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from '@material-ui/core';

const ClassList = () => {
  const dispatch = useDispatch();
  const { classes, loading, error } = useSelector((state) => state.class);

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Classes
      </Typography>
      <List>
        {classes.map((cls) => (
          <ListItem key={cls._id}>
            <ListItemText
              primary={cls.name}
              secondary={`Teacher: ${cls.teacher.name}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ClassList; 