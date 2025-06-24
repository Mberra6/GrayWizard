import React, { useState } from 'react';
import { useAuth } from '../../AuthProvider'; // Custom hook to manage authentication state
import { HiX } from 'react-icons/hi'; // Icons for close (cross)
import { FaBars } from 'react-icons/fa'; // Icon for hamburger menu
import { FaHatWizard } from "react-icons/fa6"; // Custom icon (not a standard FontAwesome icon)
import { Link, useNavigate } from 'react-router-dom'; // Navigation link component and hook for programmatic navigation
import './styles.scss'; // Component-specific styles

// Data array for navbar links specific to members
const data = [
    { label: 'Home', to: '/member/home' },
    { label: 'About', to: '/member/about' },
    { label: 'Encryption/Decryption', to: '/member/encryptionDecryption' },
    { label: 'Password Strength Checker', to: '/member/passwordStrengthChecker' },
    { label: 'Learn', to: '/member/learn' },
    { label: 'Profile', to: '/member/profile' },
    { label: 'Logout', to: '/' },
];

// Functional component definition using arrow function syntax
const NavBarMember = () => {
    const navigate = useNavigate(); // Hook to perform navigation
    const { setAuth, user } = useAuth(); // Custom hook to access auth state and update it
    const [toggleIcon, setToggleIcon] = useState(false); // State for managing mobile menu toggle

    // Function to handle mobile menu icon toggle
    const handleToggleIcon = () => {
        setToggleIcon(!toggleIcon); // Toggle boolean state
    }

    // Function to handle logout
    const logout = () => {
        window.localStorage.clear(); // Clear all local storage (removing session tokens, etc.)
        setAuth(false); // Update authentication state to false
        navigate('/'); // Redirect user to the homepage
    }

    return (
        <div>
            <nav className='navbar'>
                <div className='navbar__container'>
                    <Link to={'/'} className="navbar__container__logo">
                        <FaHatWizard size={30} />
                    </Link>
                </div>
                <ul className={`navbar__container__menu ${toggleIcon ? "active" : ""}`}>
                    {
                        data.map((item, key) => (
                            item.label === 'Logout' ?
                            <li key={key} className='navbar__container__menu__item'>
                                <Link onClick={logout} className='navbar__container__menu__item__links' to={item.to}>
                                    {item.label}
                                </Link>
                            </li> :
                            <li key={key} className='navbar__container__menu__item'>
                                <Link onClick={handleToggleIcon} className='navbar__container__menu__item__links' to={item.to}>
                                    {item.label}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
                <div className='nav-icon' onClick={handleToggleIcon}>
                    {
                        toggleIcon ? <HiX size={30}/> : <FaBars size={30}/> // Display X icon if menu is open, otherwise bars
                    }
                </div>
            </nav>
        </div>
    )
}

export default NavBarMember; // Export the component for use in other parts of the application
