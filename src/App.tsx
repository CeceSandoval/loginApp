import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StateProvider from './context/StateProvider';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignUpPassenger from './pages/SignUpPassenger';
import Admin from './pages/Admin';

function App() {
  return (
    <StateProvider>
      <div className='min-h-screen flex flex-col justify-center items-center'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='signupPassenger' element={<SignUpPassenger />} />
            <Route path='Admin' element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </StateProvider>
  );
}

export default App;

