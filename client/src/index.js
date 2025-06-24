// Importing the necessary modules from React and ReactDOM libraries.
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importing the global stylesheet for the application.
import './index.css';

// BrowserRouter alias 'Router' is imported from 'react-router-dom' for handling client-side routing.
import { BrowserRouter as Router } from 'react-router-dom'; 

// Importing the AuthProvider component, which will manage the authentication state context throughout the application.
import AuthProvider from './AuthProvider';

// Importing the App component, which is the root component of the application.
import App from './App';

// Creating the root container where the React application will attach. This ties the React app to an HTML element with the ID 'root'.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the application within the React.StrictMode component for highlighting potential problems in an application.
// It helps with identifying unsafe lifecycles, legacy API usage, and a number of other features.
root.render(
  <React.StrictMode>
    <Router> {/* Router component to enable history API and routing capabilities across the application. */}
      <AuthProvider> {/* AuthProvider wraps the App to provide authentication state via context to all child components. */}
        <App /> {/* App is the main component that contains the structured layout and routing of the entire application. */}
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
