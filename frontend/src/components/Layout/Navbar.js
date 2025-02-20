import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import { logout } from '../../redux/slices/authSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  userName: {
    marginRight: theme.spacing(2),
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  if (!userInfo) return null;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            School Management System
          </Typography>
          <Typography variant="body1" className={classes.userName}>
            {userInfo.name} ({userInfo.role})
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            LOGOUT
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar; 