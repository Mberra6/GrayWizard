import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

/**
 * Component to handle route permissions for admin areas
 * Ensures that only authenticated admin users can access certain routes
 */
const AdminRoutes = () => {
    // Use the custom hook to access the authentication status and user data
    const { auth } = useAuth();

    // Retrieve the isAdmin flag from localStorage and convert to integer for comparison
    const isAdmin = parseInt(localStorage.getItem('isAdmin'));
    
    // Conditionally render routes based on authentication and admin status
    return (
        <>
        { (() => {
            // Check if the user is authenticated and an admin
            if (auth && isAdmin === 1) {
                // Allow access to the child routes using Outlet component
                return <Outlet/>
            } else if (auth) {
                // If authenticated but not an admin, redirect to member home
                return <Navigate to="/member/home"/>
            } else {
                // If not authenticated, redirect to the public home page
                return <Navigate to="/"/>
            }
        })()}
        </>
    );
}

export default AdminRoutes; // Export the component for use in App or other components
