import React,{useState,useEffect} from 'react';
import '../style.css'; // Assuming you have CSS for styling
import './Navbar.css';
import Logo from '../../Photos/Logo.png'
import profilePhoto from  '../../Photos/defaultprofile.png'
import { Link } from 'react-router-dom';

export function Navbar(props) {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/subjects/');
        const data = await response.json();
        console.log(data)
        setSubjects(data);
    } catch (error) {
        console.error('Failed to fetch subjects:', error);
    }
   };

    useEffect(() => {
      fetchSubjects();
    }, []);

  
  return (
    <nav className="navbar navbar-expand-md navbar-light fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={Logo} alt="Logo" />
                </Link>
                <button
                    className="navbar-toggler d-md-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#menuitems"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="menuitems">
                    <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                       <li className="nav-item dropdown">
                         <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                           Explore Subjects
                         </Link>
                         
                         <ul className="dropdown-menu" >
                         {subjects.map((subject) => (
                           <li key={subject.id} >
                              <Link className="dropdown-item" to={`/subject/${subject.id}`}>{subject.name}</Link></li> ))}
                         </ul>
                       </li>
                    </ul>
                   
                    <div className="d-flex ms-auto align-items-center">
                        <div className="dropdown">
                            <button
                                className="btn profile-button"
                                type="button"
                                id="profileDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img
                                    src={profilePhoto} // Use the path to your profile photo
                                    alt="Profile"
                                    className="profile-photo"
                                />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                            {!props.isLoggedIn &&(
                                <>
                                <li><Link className="dropdown-item" to="/login">Login</Link></li>
                                <li><Link className="dropdown-item" to="/signup">Signup</Link></li>
                                
                                </>
                            )}
                            {props.isLoggedIn &&(
                                <>
                                <li> </li>
                                <li><Link className="dropdown-item" to="/"><i class="bi bi-house-door-fill">  </i> Home</Link></li>
                                <li><Link className="dropdown-item" to="/Profile"><i class="bi bi-person-circle">  </i> Profile</Link></li>
                                <li><Link className="dropdown-item" to="/Mylearing"><i class="bi bi-book-half">  </i>  My Courses</Link></li>
                                <li><Link className="dropdown-item" to="/logout"><i class="bi bi-box-arrow-left"> </i> Logout</Link></li>
                                
                                </>
                            )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
  );
}

export function Footer (){
    return (
      <footer className="footer text-center">
      <div className="social-media-section ">
        <div className="connect-text">
          <span>Get connected with us on social networks</span>
        </div>
        <div id="socialmedia">
          <Link to="#" className="fa fa-facebook me-4" target="_blank"></Link>
          <Link to="#" className="fa fa-twitter me-4" target="_blank"></Link>
          <Link to="#" className="fa fa-instagram me-4" target="_blank"></Link>
          <Link to="#" className="fa fa-google me-4" target="_blank"></Link>
        </div>
      </div>


    <div className="container">
      <div className="footer-content">
        <div className="footer-column">
          <h6>Ecademy</h6>
          <p className="footer-description">Ecademy is democratising education, making it accessible to all. We envision a world where anyone, anywhere can transform their lives through learning.</p>
        </div>
  
        <div className="footer-column text-center">
          <h6>Quick Links</h6>
          <p className="footerLinks"><a href="/">Home</a></p>
          <p className="footerLinks"><a href="/">Contact Us</a></p>
          <p className="footerLinks"><a href="/">About Us</a></p>
          <p className="footerLinks"><a href="/">Privacy Policy</a></p>
        </div>
  
          <div className="footer-column">
          <h6>Get in Touch</h6>
          <p className="contact-info"><i className="fa fa-home"></i> Ahmedabad, AHM 380013, INDIA</p>
          <p className="contact-info"><i className="fa fa-envelope"></i> Ecademylearing@gmail.com</p>
          <p className="contact-info"><i className="fa fa-phone"></i> +91 94298 70435</p>
          <p className="contact-info"><i className="fa fa-print"></i> +91 98980 52549</p>
          </div>
         </div>
      </div>
      <div className="text-center copyright-section">
        Copyright © 2024 <Link className="text-black" to="/">Ecademy Learning Platform</Link> | Powered by Ecademy
      </div>
    </footer>
         );
     };
     