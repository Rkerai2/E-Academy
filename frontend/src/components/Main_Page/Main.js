import React,{useState,useEffect} from "react";
import { Link } from 'react-router-dom';
import educationImage from '../../Photos/home-illustration.svg';
import api from '../../API';
import './Main.css';

function Main(props){
      const [courses, setCourses] = useState([]);  // To store all or filtered courses
      const [searchQuery, setSearchQuery] = useState('');  // To store the search query
      const [loading, setLoading] = useState(false); 

     const fetchCourses = async (query = '') => {
      setLoading(true);  // Set loading to true when fetching data
      try {
          const response = await api.get(`/api/search-courses/?q=${query}`);
          setCourses(response.data);
      } catch (error) {
          console.error("Error fetching courses:", error);
      }
      setLoading(false);  // Set loading to false when data is loaded
      }; 

      useEffect(() => {
        fetchCourses();  // Fetch all courses initially
       }, []);

       
    const handleSearch = (event) => {
      event.preventDefault();  // Prevent form submission default behavior
      fetchCourses(searchQuery);  // Fetch courses based on search query
     };


    const [subjects, setSubjects] = useState([]);
    const [visibleSubjects, setVisibleSubjects] = useState(4); // Default visible subjects
    const [showMore, setShowMore] = useState(false); // Toggle for show more/less

    // Fetch subjects from API
    const fetchSubjects = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/subjects/');
            const data = await response.json();
            setSubjects(data);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    // Toggle between show more and show less
    const toggleShowMore = () => {
        setShowMore(!showMore);
        setVisibleSubjects(showMore ? 4 : subjects.length); // Show more or reset to 4
    };

    

    return(
      <>
      {!props.isLoggedIn &&(
          <div className="container Dashboard">
            <div className="row">
            
              <div className="content col-sm-12 col-md-12 col-lg-8" id="homecontent">
    
                <h1 className="display-4 ">LEARN  WITHOUT<br/> LIMITS</h1>
                <br/>
                <p>
                  Take the next step toward your personal and <br/> professional goals with Ecademy.
                  Start,<br/> switch, or advance your career with India's Top Educators
                  </p>
                  <div className="col-8">
                    <Link className="Mainbtn btn "to="/signup">Start Learning
                    <i class="bi bi-arrow-right"></i></Link>
                  </div>
              </div>
              <div className="image-container col-sm-12 col-md-12 col-lg-4">
                        <img src={educationImage} alt="Education" className="education-image"/>
              </div>
            
            </div>
          </div>)}

          {props.isLoggedIn &&(
          <div className="container Dashboard">
            <div className="row">
              <div className="Main-Top">
                  </div>
            </div>
          </div>)}


          <div className="search-container ">
             <section className="search-section">
               <h1 className="search-heading">
                 Find the <span className="highlight-text">Course</span> Now!
               </h1>
           
               <div className="search-input-wrapper">
                 <form onSubmit={handleSearch} className="search-form">
                   <input
                     type="text"
                     placeholder="What Do you Want to Learn..."
                     className="search-input"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                   <button className="search-btn btn" type="submit">
                     <i className="fa fa-search"></i>
                   </button>
                 </form>

               </div>
             </section>
           </div>


           <div className="Main-courses-list mt-4">
              <h2>Courses For You! </h2><hr/>
                  <div className="container Main-course col-lg-3 col-md-4 col-sm-6">
                    {loading ? (
                        <p>Loading courses...</p>
                    ) : courses.length > 0 ? (
                        courses.map(course => (
                            <div key={course.id} className="Main-coursecard">
                             <Link to={`/course/${course.id}`} className="">
                                <img
                                  src={`http://localhost:8000${course.course_image}`}
                                  alt={course.name}
                                  className="Main-courseimage"
                                />
                             </Link>
                             <div className="Main-content">
                                  <h5>{course.name}</h5>
                             </div>
                             <div className="view-program">
                                  <Link to={`/course/${course.id}`}>
                                  <button className="view-program-btn">View Program</button>
                                  </Link>
                             </div>
                            </div>
                              ))
                          ) : (
                              <p>No courses found.</p>
                          )}
                  </div>
             </div>

             <div className="Dashboard" id="dashboard">
                <h1>Explore Courses By Category <br/><hr style={{width:'95%' }}/></h1>
                {subjects.slice(0, visibleSubjects).map((subject) => (
                    <div className="container course col-sm-12 col-md-6 col-lg-3" key={subject.id}>
                        <div className="card-container d-flex flex-wrap flex-md-wrap flex-lg-wrap subject-card ">
                            <Link to={`/subject/${subject.id}`} className="">
                            <img
                                src={`http://localhost:8000${subject.icon}`}  // Display the subject image
                                alt={subject.name}
                                className="subject-image"
                            />
                            </Link>
                            <div className="card-body">
                              {<h5 className="card-title">{subject.name}</h5>}
                              <p>
                                 {subject.courses.length} courses<strong><i class="bi bi-arrow-right"></i></strong>
                              </p>
                            </div>
                            
                        </div>
                    </div>
                ))}

            <div className="mt-3 show">
                <button onClick={toggleShowMore} className="btn ">
                    {showMore ? 'Show Less' : 'Show More'}
                </button>
            </div>
         </div>

         </>
    )

}
export default Main;