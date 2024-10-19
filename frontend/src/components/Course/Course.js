import React,{useState,useEffect} from "react";
import { useNavigate,useParams } from 'react-router-dom';
import './Course.css'; 
import api from '../../API';



function Course(){
  const { course_id } = useParams(); 
  const [course, setCourse] = useState(null); 
  const [selectedModule, setSelectedModule] = useState(null); 
  const [activeModule, setActiveModule] = useState(null);
  const [openVideoId, setOpenVideoId] = useState(null); 
  const [watchedVideos, setWatchedVideos] = useState([]); 
  const [review, setReview] = useState({ stars: '', text: '' }); 
  const [userReview, setUserReview] = useState(null); 
  const [reviewVisible, setReviewVisible] = useState(false); 
  const [loading, setLoading] = useState(false);

  const courseContent=async()=>{
      await api.get(`/api/Courses/${course_id}/`).then((res)=>{
      setCourse(res.data)
      setSelectedModule(res.data.modules[0]);
    }).catch((err)=>{
      alert(err.response.data.error)
    })
  }


  const fetchUserReview = async () => {
    await api.get(`/api/courses/${course_id}/reviews/`).then((res) => {
      const userReview = res.data.find(r => r.reviewer === "current_user"); // Replace "current_user" with actual user identifier
      if (userReview) {
        setUserReview(userReview);
        setReview({ stars: userReview.stars, text: userReview.text });
      }
    }).catch((err) => {
      console.error('Error fetching user review:', err);
    });
   
  };

  useEffect(() => {
    const init = () =>{
      courseContent()
      fetchUserReview();  
      const savedReview = JSON.parse(localStorage.getItem(`review_${course_id}`));
      if (savedReview) {
        setReview(savedReview);
      } 
    }
    init()
  }, [course_id]);
 
  useEffect(() => {
    localStorage.setItem(`review_${course_id}`, JSON.stringify(review));
  }, [review, course_id]);

  // Handle module click
  const handleModuleClick = (module) => {
    setSelectedModule(module); // Update the selected module
  };

  const toggleModule = (id) => {
    setActiveModule(activeModule === id ? null : id);
  };

  const toggleReviewForm = () => {
    setReviewVisible(!reviewVisible);
  };


  const handleVideoClick = (videoId) => {
    setOpenVideoId(openVideoId === videoId ? null : videoId); 
    setWatchedVideos([...watchedVideos, videoId]); 
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(`/api/courses/${course_id}/reviews/`, review);
      setUserReview(response.data); // Set the user's review after submission
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearReview = async () => {
    if (userReview && userReview.id) {
        try {
            await api.delete(`/api/courses/${course_id}/reviews/${userReview.id}/`);
            setUserReview(null); // Clear the review state
            setReview({ stars: '', text: '' }); // Reset the form
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    }
  };

  return ( 
     <>

    <div className="coursehome" id="home">
    {course ? (
      <div className="course-page">
        <h1>{course.name}</h1>
        <hr />
        <div className="course-content">
          {/* Course Modules */}
          <div className="course-modules">
            <h3>Course Material</h3>
            <ul>
              {course.modules.map((module, index) => (
                <li
                  key={module.id}
                  className={module === selectedModule ? "selected" : ""}
                  onClick={() => handleModuleClick(module)}
                >
                  {`Module ${index + 1}`}
                </li>
              ))}
            </ul>
          </div>

          {/* Selected Module Content */}
          {selectedModule && (
            <div className="modulecontent">
              <div className="modulecard">
                <div className="moduleheader" onClick={() => toggleModule(selectedModule.id)}>
                  <div className="moduletitle">
                    <div className="titletext">
                      <i className={`bi bi-chevron-${activeModule === selectedModule.id ? 'down' : 'right'}`}></i>
                      <span style={{ paddingLeft: '10px' }}>{selectedModule.title}</span>
                    </div>
                  </div>
                </div>

                {activeModule === selectedModule.id && (
                  <div className="module-body">
                    <p>{selectedModule.description}</p>
                    <h6><strong>Content</strong></h6>
                    
                    <ul className="video-list">
                        {selectedModule.videos.map((video) => (
                          <li key={video.id} className="video-item">
                            <div
                              className="video-title"
                              onClick={() => handleVideoClick(video.id)}
                            >
                              <i
                                className={`bi ${
                                  watchedVideos.includes(video.id) 
                                    ? 'bi-check-circle' 
                                    : 'bi-play-circle'
                                }`}
                              ></i>
                              
                              <span style={{ paddingLeft: '10px' }}>
                                {video.Title}
                              </span>
                            </div>

                            {/* Show the YouTube Video if clicked */}
                            {openVideoId === video.id && (
                              <div className="video-embed">
                                <iframe
                                  width="560"
                                  height="315"
                                  src={`https://www.youtube.com/embed/${video.video_url}`}
                                  title={video.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>

                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    ) : (
      <p>Loading course...</p>
    )}
  </div>


  <div className="review-section">
        {/* Button to toggle the review form */}
        <button className="rate-course-btn" onClick={toggleReviewForm}>
          Review This Course
        </button>

        {/* Conditionally render the form based on state */}
        {reviewVisible && (
          <div className="review-form-container">
            <form onSubmit={handleReviewSubmit} className="review-form">
              <label>
                Rating:
                <input
                  type="number"
                  value={review.stars}
                  onChange={(e) => setReview({ ...review, stars: e.target.value })}
                  min="1"
                  max="5"
                  required
                  disabled={userReview !== null}
                />
              </label>
              <label>
                Review:
                <textarea
                  value={review.text}
                  onChange={(e) => setReview({ ...review, text: e.target.value })}
                  placeholder="Write your review"
                  required
                  disabled={userReview !== null}
                ></textarea>
              </label>
              <div className="Buttondiv">
              <button type="submit" className="submit-review-btn" disabled={loading || userReview !== null}>
                {loading ? 'Submitting...' : userReview ? 'Review Submitted' : 'Submit Review'}
              </button>
              {userReview && (
                <button type="button" onClick={handleClearReview} className="clear-review-btn">
                  Clear Review
                </button>
              )}</div>
            </form>
          </div>
        )}
      </div>


   </>
  );
};


export default Course;