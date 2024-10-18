import React, { useState, useEffect } from 'react';
import api from '../../API';
import './UserProfile.css'
import axios from 'axios';

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email:'',
    phone_number: '',
    user_profile_image: null,
   });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeSection, setActiveSection] = useState('showProfile');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/api/profile/')
        .then((response) => {
            setProfileData(response.data);
            setFormData({
                name: response.data.name,
                email:response.data.email,
                phone_number: response.data.phone_number,
            });
        })
        .catch((error) => {
            console.error('There was an error fetching the profile data!', error);
        });
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });
  };

// Handle image input changes
  const handleFileChange = (e) => {
    setFormData({
        ...formData,
        user_profile_image: e.target.files[0],
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone_number', formData.phone_number);
    data.append('email',formData.email)
    if (formData.user_profile_image) {
        data.append('user_profile_image', formData.user_profile_image);
    }

    api.post('/api/profile/', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then((response) => {
            setProfileData(response.data);
            setActiveSection('showProfile')

        })
        .catch((error) => {
            console.error('There was an error updating the profile!', error);
        });
   };

   const handleChangePassword = async (e) => {
      e.preventDefault();
      setMessage(null);
    
      if (newPassword !== confirmPassword) {
        setMessage("New Passwprd Doesn't Match")
        return;
      }

      try {
        const response = await api.post('/api/profile/change-password/', {
            old_password: oldPassword,
            new_password: newPassword,
        });

        setMessage(response.data.message);
        } catch (error) {
          console.error('There was an error fetching the profile data!', error);
       }
       };


   if (!profileData) {
    // Render a loading state while fetching the profile data
    return <div>Loading...</div>;
   }
   
  

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <img 
           src={profileData.user_profile_image ? `http://localhost:8000${profileData.user_profile_image}` : '/path/to/default/avatar.png'} 
          className="profile-image" 
        />
        <h3>{profileData.name.toUpperCase()}</h3>

        <button onClick={() => setActiveSection('showProfile')}>
          Show Profile
        </button>
        <button onClick={() => setActiveSection('updateProfile')}>
          Update Profile
        </button>
        <button onClick={() => setActiveSection('changePassword')}>
          Change Password
        </button>
      </div>

      <div className="profile-content">
        {activeSection === 'showProfile' && (
          <div className="show-profile">
            <h2>Personal Details</h2>
            <hr/>
            <div className='userDetail'><p><strong>Name  :</strong> <span style={{paddingLeft:'14px'}}>{ profileData.name}</span></p></div>
            <div className='userDetail'><p><strong>Email :</strong> <span style={{paddingLeft:'14px'}}>{ profileData.email}</span></p></div>
            <div className='userDetail'><p><strong>Phone :</strong> <span style={{paddingLeft:'10px'}}>{ profileData.phone_number}</span></p></div>
          </div>
        )}

        {activeSection === 'updateProfile' && (
          <div className="update-profile">
            <h2>Update Profile</h2>
            <hr/>
            <form onSubmit={handleSubmit} className='Profile-form'>
               <label>
                Name:
                <input type="text" name="name" placeholder={profileData.name} onChange={handleChange}/>
               </label>
               <label>
                Phone Number:
                <input type="number" name="phone_number" placeholder={profileData.phone_number} onChange={handleChange}/>
               </label>
               <label>
                Email:
                <input type="email" name="email" placeholder={profileData.email} onChange={handleChange}/>
               </label>
               <label>
                Profile Image:
                <input type="file" name="user_profile_image" onChange={handleFileChange}/>
               </label>
              <button type="submit">Update Profile</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        )}

        {activeSection === 'changePassword' && (
          <div className="change-password">
            <h2>Change Password</h2>
            <hr/>
            <form onSubmit={handleChangePassword} className='Profile-form'>
              <label>
                Old Password:
                <input type="password" name="old_password"  onChange={(e) => setOldPassword(e.target.value)} required />
              </label>
              <label>
                New Password:
                <input type="password" name="new_password" onChange={(e) => setNewPassword(e.target.value)} required />
              </label>
              <label>
               Confirm New Password:
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
              </label>
              <button type="submit">Change Password</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile
