/**
 * AuthProvider Component
 * 
 * This component serves as a context provider for authentication-related data across the entire application.
 * It uses a React context (`AuthContext`) to provide a centralized state management for authentication status and user information.
 * This allows child components to access and modify authentication state without prop drilling.
 * 
 * Features:
 * - Manages authentication state using React's Context API and provides a custom hook (`useAuth`) for easy access.
 * - Automatically checks and updates authentication status using an Axios request to a backend server when the application loads or when relevant data changes.
 * - Uses local storage to retrieve the user's authentication token and admin status, providing persistent login capability.
 * - Encapsulates authentication logic within a provider component, ensuring that all child components have access to the authentication state through a clean and simple API.
 * 
 * Usage:
 * Wrap your application's component tree with this provider to enable global access to authentication data.
 */
 import { createContext, useContext, useEffect, useState } from 'react';
 import axios from 'axios';
 
 const AuthContext = createContext({
   auth: null,    // Represents the authentication state, null by default.
   setAuth: () => {}, // Function to update the authentication state, no operation by default.
   user: null,    // Stores the user object, null by default.
 });
 
 export const useAuth = () => useContext(AuthContext);
 
 const AuthProvider = ({ children }) => {
   const [auth, setAuth] = useState(null); // State to track authentication status.
   const [user, setUser] = useState(null); // State to store user details.
   const token = localStorage.getItem('token'); // Retrieve the authentication token from local storage.
 
   useEffect(() => {
     const isAuth = async () => {
       try {
         const res = await axios.get(
           `${process.env.REACT_APP_API_URL}/api/member/auth`, 
           {
             headers: { authorization: "Bearer " + token }, // Include the token in the authorization header.
             withCredentials: true // Ensure credentials are included in the request for session handling.
           }
         );
         setUser(res.data); // If successful, set the user data with the response.
       } catch(error) {
         setUser(null); // On failure (e.g., token invalid), reset user to null.
       };
     };
 
     isAuth(); // Call the async function to check auth status.
   }, [auth, token]); // Dependencies for the effect, causing re-run when these values change.
 
   return (
     <AuthContext.Provider value={{ auth, setAuth, user }}>
       {children} {/* Children components that will have access to the auth context */}
     </AuthContext.Provider>
   );
 };
 
 export default AuthProvider;
 