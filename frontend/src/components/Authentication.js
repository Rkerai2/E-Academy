import React, { useState,useEffect } from 'react';
import api from '../API'
import { Link } from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';



export function Register() {
    const [name,setName]=useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/api/register/', {name, email, password}).then((res)=>{
            setMessage(res.data.detail)
            setMessageType('success')
            // Navigate to login page after successful registration
            setTimeout(() => {
                navigate('/login'); 
            }, 1000);

        }).catch((err)=>
            setMessage("User Is Already Defined With This EmailId")
            
    )


    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="Register d-flex justify-content-center" id='Authentication'>
            <div className="col-md-6">
                <div className="card Auth">
                    <div className="card-body ">
                        <h2 className="text-center ">Register</h2>
                        <p  className='text-center fs-14'>Learn on Your Own Time With <br/>Top Educators</p>
                        {message && (
                            <div className={`message ${messageType === 'success' ? 'message-success' : 'message-error'}`}>
                            <i className={`icon ${messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}`}></i>
                            {message}
                        </div>
                         )}
                        <hr className='align-item-center'/>
                        <form onSubmit={handleSubmit}>
                           <div className="form-group mb-3 ">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type={
                                        showPassword ? "text" : "password"
                                    }
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="password-toggle position-absolute"
                                    style={{ right: '170px',bottom:'175px', cursor: 'pointer' }}
                                    onClick={togglePasswordVisibility}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </span>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Join Now</button>
                            <p className='text-center'>Already Connected With Us? <Link  to="/login">Login</Link></p>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export function Login(props){
    const [currentUser, setCurrentUser] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate(); 

      async function handleSubmit(e) {
        e.preventDefault();
        await api.post('/api/token/', {email, password}).then((res)=>{
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            props.changeLogIn(true)
            setMessage("Login SucessFully")
            setMessageType('success')
            setTimeout(() => {
                navigate('/'); 
            }, 1000);
        }).catch((err)=>{
            setMessage("Password or Email Doesn't Match")
        })
      }

      


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="Register d-flex justify-content-center" id='Authentication'>
            <div className="col-md-6">
                <div className="card ">
                    <div className="card-body ">
                        <h2 className="text-center ">Login</h2>
                        <p  className='text-center fs-14'>Learn on Your Own Time With <br/>Top Educators</p>
                        {message && (
                            <div className={`message ${messageType === 'success' ? 'message-success' : 'message-error'}`}>
                            <i className={`icon ${messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}`}></i>
                            {message}
                        </div>
                         )}
                        <hr className='align-item-center'/>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type={
                                        showPassword ? "text" : "password"
                                    }
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="password-toggle position-absolute"
                                    style={{ right: '170px',bottom:'175px', cursor: 'pointer' }}
                                    onClick={togglePasswordVisibility}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </span>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                            <p className='text-center'>New To Ecademy? <Link  to="/signup">Signup</Link></p>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

