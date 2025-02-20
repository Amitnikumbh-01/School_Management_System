import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import Navbar from './components/Layout/Navbar';

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo && userInfo.role === role ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const AppContent = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  // Hide navbar on login and register pages
  const showNavbar = userInfo && !['/login', '/'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Switch>
        <Route exact path="/" component={Register} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/admin" role="admin" component={AdminDashboard} />
        <PrivateRoute path="/teacher" role="teacher" component={TeacherDashboard} />
        <PrivateRoute path="/student" role="student" component={StudentDashboard} />
      </Switch>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 