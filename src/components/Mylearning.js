import React, { useEffect, useState } from 'react';
import api from '../API';
import { Link } from 'react-router-dom';

const MyLearing = () => {
    const [courses, setCourses] = useState([]);

    const fetchEnrolledCourses = async () => {
          await api.get('/api/Mylearning/').then((res)=>{
            setCourses(res.data);
          }).catch((err)=>{
            alert('Error fetching enrolled courses:');

          })
     };

    useEffect(() => {
      const init = ()=>{
        
        fetchEnrolledCourses();
      }
      init()
    }, []);

    return (
        <div className="container Dashboard" style={{marginTop:'100px'}}>
            <section id="recommendation">
              <div className='recommendation-container'>
                <h1>My Learning</h1>
                <hr/>
        
                <div className="courses-list mt-4">
                {courses.map((course) => (
                  <div className="container course col-lg-3 col-md-4 col-sm-6" key={course.id}>
                    <div className="coursecard">
                    <Link to={`/course/${course.id}`} className="">
                      <img
                        src={`http://localhost:8000${course.course_image}`}
                        alt={course.name}
                        className="courseimage"
                      />
                      </Link>
                      <h5>{course.name}</h5>
                    </div>
                  </div>
                ))}
                </div>
             </div>
            </section>
        </div>
    );
};

export default MyLearing;