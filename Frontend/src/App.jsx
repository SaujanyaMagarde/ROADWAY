import React from 'react'
import {Route,Routes} from 'react-router-dom'
import  Start from './pages/start.jsx'
import UserSignup from './pages/UserSignup.jsx'
import UserLogin from './pages/UserLogin.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import UserProtectecdWrapper from './components/UserProtectecdWrapper.jsx'
import CaptainProtectecdWrapper from './components/CaptainProtectedWrapper.jsx'
import Home from './pages/Home.jsx'
import CaptainHome from './pages/CaptainHome.jsx'
import Riding from './pages/Riding.jsx'
import CaptainRiding from './pages/captainRiding.jsx'
import UserProfile from './components/UserProfile.jsx'
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start/>}/>
        <Route path='/user-login' element={<UserLogin/>}/>
        <Route path='/user-profile' element={<UserProtectecdWrapper><UserProfile/></UserProtectecdWrapper>}/>
        <Route path='/user-signup' element={<UserSignup/>}/>
        <Route path='/riding' element={<UserProtectecdWrapper><Riding/></UserProtectecdWrapper>}/>
        <Route path='/captain-login' element={<CaptainLogin/>}/>
        <Route path='/captain-signup' element={<CaptainSignup/>}/>
        <Route path='/user-home' element={<UserProtectecdWrapper><Home/></UserProtectecdWrapper>} />
        <Route path='/captain-home' element={<CaptainProtectecdWrapper><CaptainHome/></CaptainProtectecdWrapper>}   />
        <Route path='/captain-riding' element={<CaptainProtectecdWrapper><CaptainRiding/></CaptainProtectecdWrapper>}   />
      </Routes>
    </div>
  )
}

export default App