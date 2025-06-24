// Import necessary components from react-router-dom for navigation control
import { Outlet, Navigate } from 'react-router-dom';
// Import authentication context to determine user status
import { useAuth } from '../AuthProvider';

/**
 * Component to handle private route redirection based on user authentication status and roles.
 * It ensures that only authenticated users can access certain routes,
 * and redirects users based on their roles.
 */
const PrivateRoutes = () => {
    // Retrieve the authentication status from the context
    const { auth } = useAuth();

    // Parse the 'isAdmin' value from local storage to determine if the user is an admin
    const isAdmin = parseInt(localStorage.getItem('isAdmin'));
    
    // Conditionally render routes or redirect based on user status
    return (
        <>
        { (() => {
            // If the user is authenticated and is an admin, redirect them to the admin home page
            if (auth && isAdmin === 1) {
                return <Navigate to="/admin/home"/>
            } 
            // If the user is authenticated but not an admin, allow access to private user routes
            else if (auth) {
                return <Outlet/>
            } 
            // If not authenticated, redirect to the public home page
            else {
                return <Navigate to="/"/>
            }
        })()}
        </>
    );
}

export default PrivateRoutes; // Export the component for use in the app's routing system
