// Import necessary React libraries and icons for the component
import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';  // Icon used for closing the mobile menu
import { FaBars } from 'react-icons/fa';  // Icon used for opening the mobile menu
import { FaHatWizard } from "react-icons/fa6";  // Custom icon for the site logo
import { Link } from 'react-router-dom';  // Import Link component for navigation without page reloads
import './styles.scss';  // Import the stylesheet for the Navbar

// Static data for navigation links
const data = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Encryption/Decryption', to: '/encryptionDecryption' },
    { label: 'Password Strength Checker', to: '/passwordStrengthChecker' },
    { label: 'Learn', to: '/learn' },
    { label: 'Register/Login', to: '/registerLogin' },
];

// Functional component for the Navbar
const NavBar = () => {
    // State to control the toggle state of the mobile menu
    const [toggleIcon, setToggleIcon] = useState(false);

    // Function to toggle the mobile menu visibility
    const handleToggleIcon = () => {
        setToggleIcon(!toggleIcon);  // Toggle the state to show/hide the menu
    }

    return (
        <div>
            <nav className='navbar'>
                <div className='navbar__container'>
                    {/* Logo link to the homepage */}
                    <Link to={'/'} className="navbar__container__logo">
                        <FaHatWizard size={30} /> 
                    </Link>
                </div>
                {/* Menu items that may be shown/hidden on mobile */}
                <ul className={`navbar__container__menu ${toggleIcon ? "active" : ""}`}>
                    {data.map((item, key) => (
                        <li key={key} className='navbar__container__menu__item'>
                            {/* Link for each navigation item; closes the mobile menu on click */}
                            <Link onClick={handleToggleIcon} className='navbar__container__menu__item__links' to={item.to}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                {/* Toggle icon changes between bars and X based on menu state */}
                <div className='nav-icon' onClick={handleToggleIcon}>
                    {toggleIcon ? <HiX size={30}/> : <FaBars size={30}/>}
                </div>
            </nav>
        </div>
    )
}

export default NavBar;  // Export the NavBar component for use in other parts of the application
