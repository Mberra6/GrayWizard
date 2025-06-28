// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaEdit } from "react-icons/fa"; // Icon for visual enhancement
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
        created_at: '',
        password: '********'
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [fieldToEdit, setFieldToEdit] = useState('');
    const [newValue, setNewValue] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const openModal = (field) => {
        setFieldToEdit(field);
        setNewValue(userData[field]);

        // Reset password modal values
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage('');

        setModalOpen(true);
    };

    const updateEndpointMap = {
        email: 'email',
        username: 'username',
        first_name: 'first-name',
        last_name: 'last-name',
        password: 'password'
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const updated = { ...userData, [fieldToEdit]: newValue };

        // Skip if trying to edit a non-editable field (like created_at)
        if (!updateEndpointMap[fieldToEdit]) {
            console.warn(`No endpoint configured for field: ${fieldToEdit}`);
            return;
        }

        const endpoint = `${process.env.REACT_APP_API_URL}/api/member/account/update/${updateEndpointMap[fieldToEdit]}/${user.id}`;

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: "Bearer " + token
                },
                body: JSON.stringify({ [fieldToEdit]: newValue })
            });
            if (response.ok) {
                setUserData(updated);
                setModalOpen(false);
            } else {
                const errData = await response.json();
                console.error('Error updating:', errData.message);
                setErrorMessage(errData.message);
            }
        } catch (error) {
            console.error('Update error:', error.message);
        }
    };

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
                            {['first_name', 'last_name', 'username', 'email', 'password', 'created_at'].map((field) => (
                                <div key={field} className='profile__field'>
                                    <div className="input-wrapper">
                                        <input
                                        readOnly
                                        value={userData[field]}
                                        name={field}
                                        className={field}
                                        type='text'
                                        />
                                        {field !== 'created_at' && (
                                        <FaEdit
                                            className='edit-icon-inside'
                                            onClick={() => openModal(field)}
                                        />
                                        )}
                                    </div>
                                    <label htmlFor={field} className={`${field}Label`}>
                                        {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </form>
                </Animate>
            </div>
            {modalOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h3>Update {fieldToEdit.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>

                        {fieldToEdit === 'password' ? (
                            <>
                            <input
                                type='password'
                                placeholder='Current Password'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <input
                                type='password'
                                placeholder='New Password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type='password'
                                placeholder='Confirm New Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            </>
                        ) : (
                            <input
                            type='text'
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            />
                        )}

                        <div className='modal-actions'>
                            <button onClick={handleUpdate}>Save</button>
                            <button onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                        { (() => {
                                if (errorMessage.length > 0) {
                                    return (<p className='negative'>{errorMessage}</p>)
                                }
                        })()}
                    </div>
                </div>
            )}
        </section>
    );
}

export default Profile; // Export the component for use in other parts of the application
