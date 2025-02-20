import React from 'react';
import { Paper, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

const DashboardCard = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.card}>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

export default DashboardCard; 