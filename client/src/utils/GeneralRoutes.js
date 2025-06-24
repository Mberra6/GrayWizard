// Import necessary components from react-router-dom for routing and navigation
import { Outlet, Navigate } from 'react-router-dom';
// Import the authentication context to check user status
import { useAuth } from '../AuthProvider';

/**
 * Component to manage general route access based on user authentication and role.
 * This ensures users are directed to appropriate sections of the application.
 */
const GeneralRoutes = () => {
    // Access authentication status and user details from the context
    const { auth } = useAuth();

    // Retrieve 'isAdmin' status from local storage and convert it to an integer for proper evaluation
    const isAdmin = parseInt(localStorage.getItem('isAdmin'));
    
    // Render routes conditionally based on the user's authentication and admin status
    return (
        <>
        { (() => {
            // If the user is authenticated and an admin, redirect to the admin home page
            if (auth && isAdmin === 1) {
                return <Navigate to="/admin/home"/>
            } 
            // If the user is authenticated but not an admin, redirect to the member home page
            else if (auth) {
                return <Navigate to="/member/home"/>
            } 
            // If not authenticated, allow access to the general public routes
            else {
                return <Outlet/>
            }
        })()}
        </>
    );
}

export default GeneralRoutes; // Export the component for integration into the app routing system
