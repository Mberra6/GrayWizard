// Import necessary libraries and components
import React from 'react'; // Import React to be used in the component
import './styles.scss'; // Import custom styles specific to the Home component

// Define the Home component using a functional component structure
const Home = () => {

  // Render the Home component
  return (
    <section id="home" className='home'> {/* Main container for the Home component with a unique ID and class */}
      <div className='home__text-wrapper'> {/* Wrapper for text to apply specific styling */}
        <h1>
          GrayWizard 
          <br/>
          <br/> 
          <span className='small'>Secure Your Secrets, 
          <br/> 
          Empower Your Knowledge</span> 
        </h1>
      </div>
    </section>
  )
}

export default Home; // Export Home component to be used in other parts of the application
