// Importing necessary styles, React components, and utilities
import './App.scss';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import PrivateRoutes from './utils/PrivateRoutes';
import GeneralRoutes from './utils/GeneralRoutes';
import Home from './pages/home';
import About from './pages/about';
import EncryptionDecryption from './pages/encryptDecrypt';
import PasswordStrengthChecker from './pages/passwordStrengthChecker';
import Learn from './pages/learn';
import Profile from './pages/profile';
import { RegisterLogin } from './pages/registerLogin';
import NavBar from './components/navBar';
import NavBarMember from './components/navBarMember';
import particles from './utils/particles';

function App() {
  // Use location to determine the current route
  const location = useLocation();
  // Access authentication state from context
  const { auth } = useAuth();

  // Function to initialize particles animation on specific components
  const handleInit = async (main) => {
    await loadFull(main);
  }

  // Conditions to determine where to render the particle background
  const renderParticleJsInHomePage = location.pathname === "/";
  const renderParticleJsInHomePage2 = location.pathname === "/member/home";
  const renderParticleJsInLoginPage = location.pathname === "/registerLogin";
  
  return (
    <div className="App">
      {/* Render particles.js on certain pages to enhance visual appeal */}
      {renderParticleJsInHomePage && (
        <Particles id="particles" options={particles} init={handleInit}/>
      )}
      {renderParticleJsInHomePage2 && (
        <Particles id="particles" options={particles} init={handleInit}/>
      )}
      {renderParticleJsInLoginPage && (
        <Particles id="particles" options={particles} init={handleInit}/>
      )}

      {/* Conditional rendering of navigation bars based on authentication status */}
      {auth ? <NavBarMember /> : <NavBar />}

      {/* Main content area where different routes are rendered */}
      <div className='App__main-page-content'>
        <Routes>
          <Route element={<PrivateRoutes/>}>
            <Route index path='/member/home' element={<Home/>} />
            <Route index path='/member/about' element={<About/>} />
            <Route index path='/member/encryptionDecryption' element={<EncryptionDecryption/>} />
            <Route index path='/member/passwordStrengthChecker' element={<PasswordStrengthChecker/>} />
            <Route index path='/member/learn' element={<Learn/>} />
            <Route index path='/member/profile' element={<Profile/>} />
          </Route>
          <Route element={<GeneralRoutes/>}>
            <Route index path='/' element={<Home/>} />
            <Route index path='/about' element={<About/>} />
            <Route index path='/encryptionDecryption' element={<EncryptionDecryption/>} />
            <Route index path='/passwordStrengthChecker' element={<PasswordStrengthChecker/>} />
            <Route index path='/learn' element={<Learn/>} />
            <Route index path='/registerLogin' element={<RegisterLogin/>} />
          </Route>
        </Routes>
      </div>
    
    </div>
  );
}

export default App;
