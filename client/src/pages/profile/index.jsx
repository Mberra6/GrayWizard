// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { FaUserAlt } from "react-icons/fa"; // Icon for visual enhancement
import PageHeader from '../../components/pageHeader'; // Reusable component for page headers
import { Animate } from 'react-simple-animate'; // Animation library to add visual effects
import { useAuth } from "../../AuthProvider";
import './styles.scss'; // Stylesheet for specific styling

const Profile = () => {
    const { user } = useAuth();
    // State to store the user data
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        created_at: ''
    });

    // Fetch user data from the server
    useEffect(() => {
        const userID = user.id // Retrieve the userID from local storage
        const token = localStorage.getItem('token');
        if (!userID) return; // If userID is not found, do nothing

        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/account/${userID}`, {
                    headers: { authorization: "Bearer " + token },
                });
                const data = await response.json();
                if (response.ok) {
                    setUserData({
                        username: data.member[0].username,
                        email: data.member[0].email,
                        first_name: data.member[0].first_name,
                        last_name: data.member[0].last_name,
                        created_at: data.member[0].created_at.slice(0, 10)
                    }); // Set the user data if fetch is successful
                } else {
                    throw new Error(data.message || 'Unable to fetch data');
                }
            } catch (error) {
                console.error('Fetch error:', error.message);
            }
        };

        fetchData();
    }, [user.id]);

    return (
        <section id="profile" className='profile'>
            <PageHeader
                headerText='Profile'
                icon={<FaUserAlt size={40} />}
            />
            <div className='profile__content'>
                <Animate
                    play
                    duration={1}
                    delay={0}
                    start={{ transform: "translateX(200px)" }}
                    end={{ transform: "translateX(0px)" }}
                >
                    <form className='profile__content__form'>
                        <div className='profile__content__form__controlsWrapper'>
                            <div>
                                <input readOnly value={userData.first_name} name="first_name" className='firstName' type='text'/>
                                <label htmlFor='first_name' className='firstNameLabel'>First Name</label>
                            </div>
                            <div>
                                <input readOnly value={userData.last_name} name="last_name" className='lastName' type='text'/>
                                <label htmlFor='last_name' className='lastNameLabel'>Last Name</label>
                            </div>
                            <div>
                                <input readOnly value={userData.username} name="username" className='username' type='text'/>
                                <label htmlFor='username' className='usernameLabel'>Username</label>
                            </div>
                            <div>
                                <input readOnly value={userData.email} name="email" className='email' type='text'/>
                                <label htmlFor='email' className='emailLabel'>Email</label>
                            </div>
                            <div>
                                <input readOnly value={userData.created_at} name="created_at" className='createdAt' type='text'/>
                                <label htmlFor='created_at' className='createdAtLabel'>Created</label>
                            </div>
                        </div>
                    </form>
                </Animate>
            </div>
        </section>
    );
}

export default Profile; // Export the component for use in other parts of the application
