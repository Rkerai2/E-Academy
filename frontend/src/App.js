// App.js
import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {Navbar,Footer} from './components/Navbar-Footer/Navbar';
import {Register,Login} from "./components/Authentication";
import { checkAuthorization } from './API';
import Main from './components/Main_Page/Main';
import SubjectDetail from './components/SubjectDetails';
import CourseDetail from './components/CourseDetails';
import MyLearning from './components/Mylearning';
import Course from './components/Course/Course';
import UserProfile from './components/Profile-Page/UserProfile'

const Logout =(props) =>{
  localStorage.clear()
  props.changeLogIn(false)
  return <Navigate to='/'/>
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchResults, setSearchResults] = useState([]);

  const changeLogIn = (value)=>{
    setIsLoggedIn(value)
  }
  useEffect(()=>{
    const checkAuth = async ()=>{
      const isAuth = await checkAuthorization();
      setIsLoggedIn(isAuth)
    }
    checkAuth()
  },[])
  return (
    <>
        <Router>
           <div>
               <Navbar isLoggedIn={isLoggedIn} changeLogIn={changeLogIn} setSearchResults={setSearchResults} />
                <Routes>
                   <Route path="/" element={<Main isLoggedIn={isLoggedIn} changeLogIn={changeLogIn} searchResults={searchResults} />} />
                   <Route path="/subject/:subject_id" element={<SubjectDetail />} />
                   <Route path="/course/:course_id" element={<CourseDetail isLoggedIn={isLoggedIn} />} />
                   <Route path='/Mylearing' element={<MyLearning isLoggedIn={isLoggedIn} />}/>
                   <Route path="/signup" element={<Register/>}/>
                   <Route path='/Courses/:course_id' element={<Course isLoggedIn={isLoggedIn}/>}/>
                   <Route path='/Profile' element={<UserProfile isLoggedIn={isLoggedIn}/>}/>
                   <Route  path='/login' element={<Login changeLogIn={changeLogIn}/>}/>
                   <Route  path='/logout' element={<Logout changeLogIn={changeLogIn}/>}/>
                </Routes>
             <Footer/> 
            </div>
          <Outlet/>
        </Router>
    </>
  );
};

export default App;
