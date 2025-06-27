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
    
    // Render routes conditionally based on the user's authentication
    return (
        <>
        { (() => {
           if (auth) {
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
