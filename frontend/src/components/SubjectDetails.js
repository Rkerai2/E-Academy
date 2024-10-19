import React, { useState, useEffect } from 'react';
import './style.css'; 
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const SubjectDetail = () => {
  const { subject_id } = useParams();
  const [subject, setSubject] = useState(null);
  

  const SubjectDetail= async()=>{
    try{
        const response=await fetch(`http://localhost:8000/api/subject/${subject_id}/`)
        const data= await response.json();
        setSubject(data);
    }
    catch(error){
        console.error('Failed to fetch subject:', error);
    }

  }

  useEffect(() => {
   SubjectDetail()
  }, [subject_id]);

  if (!subject) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="container Dashboard">
    <section className="section-padding bg-light" id="section">
      <div className="col-sm-12 subjectdetail">
        <div className="subjectheader d-flex justify-content-between flex-wrap">
          <img
            src={`http://localhost:8000${subject.Subject_Image}`}
            alt={subject.name}
            className="subjectimage"
          />
          <div className="subjectinfo">
            <h2>{subject.name}</h2>
            <hr />
            <p>{subject.description}</p>
            <p>
              <i className="bi bi-book-half" />
              <strong> Courses :</strong> {subject.courses.length}
            </p>
          </div>
        </div>
      </div>
    </section>
    <div className="courses-list mt-4">
    <h2>Explore Courses</h2><hr/>
   
      
        {subject.courses.map((course) => (
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
  );
};

export default SubjectDetail;
