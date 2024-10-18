import React, { useState, useEffect,useRef} from 'react';
import './style.css'; 
import Img from '../Photos/course.png'
import { Link } from 'react-router-dom';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../API';

const CourseDetail = (props) => {
  const { course_id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const overviewRef = useRef(null);
  const modulesRef = useRef(null);
  const recommendationRef = useRef(null);
  const [readMore, setReadMore] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [showContentInfo, setShowContentInfo] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);  // Enrollment status
  const [RecommendedCourse, setRecommendedCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const characterLimit = 438;
  const displayedDescription = course
  ? (readMore
    ? course.explanation
    : `${course.explanation.substring(0, characterLimit)}...`)
  : '';

  const CourseDetail= async()=>{
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/course/${course_id}/`);
      const data = response.data;
      setCourse(data.course);
      // setIsEnrolled(data.is_enrolled);  // Set enrollment status from API response
      setRecommendedCourses(data.RecommendedCourse);
    } catch (err) {
      console.error("Error fetching course details:", err);
    }

  }

  const loadIsEnrolled = async (courseId) =>{
    await api.post('/api/course/isenrolled/', {course:courseId}).then((res)=>{
      setIsEnrolled(res.data.isEnrolled)

    }).catch((err)=>{
      console.log(err)
    })
  }

  const fetchReviews = async (courseId) => {
      await api.get(`/api/courses/${courseId}/reviews/`).then((res)=>{
        setReviews(res.data);
        setLoading(false);
      }).catch((err)=>{
        console.log(err)
      })
     }

  useEffect(() => {
    const init = () =>{
      CourseDetail()   
    }
    init()
    loadIsEnrolled(course_id)
    fetchReviews(course_id)
  }, [course_id]);



  useEffect(() => {
    // Intersection observer for active section highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } 
    );

    if (overviewRef.current) observer.observe(overviewRef.current);
    if (modulesRef.current) observer.observe(modulesRef.current);
    if (recommendationRef.current) observer.observe(recommendationRef.current);

    return () => {
      if (overviewRef.current) observer.unobserve(overviewRef.current);
      if (modulesRef.current) observer.unobserve(modulesRef.current);
      if (recommendationRef.current) observer.unobserve(recommendationRef.current);
    };
  }, []);

  const scrollToSection = (section) => {
    if (section === 'overview') {
      overviewRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'modules') {
      modulesRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'recommendation') {
      recommendationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  const toggleReadMore = () => {
    setReadMore(!readMore);
  }; 
  

  const toggleModule = (id) => {
    setActiveModule(activeModule === id ? null : id);
  };

  const toggleContentInfo = (id) => {
    setShowContentInfo({
      ...showContentInfo,
      [id]: !showContentInfo[id],
    });
  };

  const handleEnroll = async () => {
    try {
  if (!props.isLoggedIn) {
    alert("Please log in to enroll in the course.");
    navigate('/login');
    return;
  }
     const response = await api.post(
      `/api/enrollcourse/${course_id}/`
    );
     if (response.data.status === 'enrolled') {
      setIsEnrolled(true);    
     }
     else if (response.data.status === 'already_enrolled') {
      setIsEnrolled(true);  
    }
    } catch (error) {
      console.error("Failed to enroll:", error);
    }
  };

  const handleGoToCourse = () => {
    navigate(`/Courses/${course_id}`);
  };


  
  
  return (
    <>
    <div className="container Dashboard">
    <section className="section-padding bg-light" id="section">
      <div className="col-sm-12 subjectdetail">
        <div className="subjectheader d-flex justify-content-between flex-wrap">
          <img
            src={`http://localhost:8000${course.course_image}`}
            alt={course.name}
            className="subjectimage"
          />
          <div className="subjectinfo">
            <h2>{course.name}</h2>
            <hr />
            <p>{course.description}</p>
            <p>{course.subject}</p>
            <p>
              <strong> Enrolled User :</strong> {course.enrolled_user.length}
            </p>
            <div className='enroll'>
            {isEnrolled ? (
              <button onClick={handleGoToCourse}>
                Go to Course
              </button>
            ) : (
              <button onClick={handleEnroll}>
                Enroll Course
              </button>
            )}
            {isEnrolled && <span style={{paddingLeft:'10px',fontStyle:"serif"}}>
              Already Enrolled</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>


  <div className="container course-detail">

      {/* Navigation Buttons */}
      <div className="button-container d-flex flex-wrap ">
        <button
          className={`nav-button ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => scrollToSection('overview')}
        >
          Overview
        </button>
        <button
          className={`nav-button ${activeSection === 'modules' ? 'active' : ''}`}
          onClick={() => scrollToSection('modules')}
        >
          Modules
        </button>
        <button
          className={`nav-button ${activeSection === 'recommendation' ? 'active' : ''}`}
          onClick={() => scrollToSection('recommendation')}
        >
          Recommended Courses
        </button>
      </div>
      <hr/>

      {/* Overview Section */}
      <section id="overview" ref={overviewRef}>
         <div className="course-overview-container">
            <h1>Overview</h1>
            <div className='course-description'>
            {displayedDescription.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
               ))}
            </div>
          </div>

          <div>
            <button onClick={toggleReadMore} className="read-more-button">
                {readMore ? 'Read less' : 'Read more'}
            </button>
          </div>
       
          <div className="col-md what-you-learn-container ">
            <h1>What You'll Learn</h1>
            <ul className="learn-points list-style-v1 list-unstyled">
              {course.WhatLearn.map((points) => (
                <li> <i class="bi bi-check-circle-fill"style={{color:'#a0f7b4',marginRight:'10px'}}></i>  {points.item}<br/></li>
              ))}
            </ul>      
          </div>

          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between what-you-learn-container ">
            <div >
            <h1>Build your subject-matter expertise</h1>
             <p className='course-description'>This course is available as part of multiple programs. When you <br/>enroll in this 
             course, you'll also be asked to select a specific program.</p>
             <ul className="expertise-points  course-description">
               <li>Learn new concepts from industry experts</li>
               <li>Gain a foundational understanding of a subject or tool</li>
               <li>Develop job-relevant skills with hands-on projects</li>
               <li>Earn a shareable career certificate</li>
             </ul>
             </div>
             <div>
             <img src={Img} alt='Image' style={{width:'90%',borderRadius:'10px', marginRight:'-100px'}}/></div>
          </div>
      </section>

      {/* Modules Section */}
      <section id="modules" ref={modulesRef}>
      <div className="modules-overview-container">
         <h1>Modules</h1>
         <hr/>

        <div className='module-detail-container'>
         {course.modules.map((module) => (
        <div key={module.id} className="module-card">
          <div className="module-header" onClick={() => toggleModule(module.id)}>
            <div className="module-title">
              <div className="title-text">{module.title} 
              <h6>Module {module.srNumber}</h6>
              </div>
              {/*<div className='ml-100'>
              <i className={`bi bi-chevron-${activeModule === module.id ? 'up' : 'down'}`}></i></div>*/}
            </div>
            
          </div>

          {activeModule === module.id && (
            <div className="module-content">
              <p style={{fontFamily:'OpenSans, Arial, sans-serif'}}>{module.description}</p>
              <h6><strong>What's included</strong></h6>
              <p><i className="bi bi-play-circle"></i><span style={{paddingLeft: '10px'}}>{module.videos.length} videos</span> </p>
              {/*<p><i className="bi bi-book-half"></i><span style={{paddingLeft: '10px'}}>{module.Content.length} Reading</span> </p>*/}

              <button className="toggle-button" onClick={() => toggleContentInfo(module.id)}>
              <i class="bi bi-chevron-right"></i> <span style={{paddingLeft: '6px'}}>
              {showContentInfo[module.id] ? 'Hide info about module content' : 'Show info about module content'}</span> 
              </button>

              {showContentInfo[module.id] && (
                <div>
                <p style={{marginLeft:'12px'}}><i className="bi bi-play-circle"></i><span style={{paddingLeft: '10px'}}>{module.videos.length} videos</span> </p>
                <ul className="video-list">
                  {module.videos.map((video) => (
                    <li key={video.id} className="video-item">
                      <span>{video.Title}</span><span style={{marginLeft:'12px',fontSize:'14px',fontWeight:'lighter'}}>( {video.duration} Minutes )</span>
                    </li>
                  ))}
                </ul>
                </div>
              )}
            </div>
          )}
          <hr/>
        </div>
         ))}
         
        </div>
      </div>
      </section>


      {/* Recommended Courses Section */}
      <section id="recommendation" ref={recommendationRef}>
        <div className='recommendation-container'>
        <h1>Recommended Courses</h1>
        <hr/>

        <div className="courses-list mt-4">
        {RecommendedCourse.map((course) => (
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

      <section id="Review-Section">
      <div className="Reviews-details">
        <h2>What's Learner Say About Course</h2>
        <hr/>

        {/* Reviews List */}
        <div className="reviews-list">
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review">
                <div className="review-header">
                <div className="avatar">
                  <img 
                    src={review.reviewer.user_profile_image} 
                    className="reviewer-avatar" 
                  />
                  </div>
                  <div className="review-info">
                    <h5>{review.reviewer.name}</h5>
                    <div className="review-meta">
                      <p className="review-stars">{'★'.repeat(review.stars)}</p>
                      <p className="review-date">
                        Reviewed on {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))
          ) : (
            <p>No reviews found.</p>
          )}
        </div>
      </div>
    </section>


  </>
  );
};

export default CourseDetail;
