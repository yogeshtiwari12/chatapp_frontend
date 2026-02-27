import React, { useEffect, useMemo } from 'react';
import Home from '../components/home/home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/login/login';
import Signup from '../components/login/signup';
import { useDispatch, useSelector } from 'react-redux';
import { getuser } from '../components/redux/authslice';
import { getUnreadCounts } from '../components/redux/messgaeslice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user,isprofile } = useSelector((state) => state.auth);

  const isauth = useMemo(() => {
    return isAuthenticated && !!user && isprofile;
  }, [isAuthenticated, user, isprofile]);
  console.log(isAuthenticated,!!user,isauth,isprofile);


  useEffect(() => {
    dispatch(getuser());
  }, [dispatch]);


  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUnreadCounts());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
