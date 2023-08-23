import { useContext } from 'react';
import Login from '../Components/Login';
import Map from '../Components//Map';
import { userContext } from '../context/StateProvider';
import Navbar from '../Components/Navbar';

const Home = () => {
  const { state } = useContext(userContext);
  console.log(state)
  return (
    <div className='min-h-screen flex flex-col '>
      {!state?.session  ? (
        
        <Login />
      ) : ((state.session.userType == "driver" )? (
        
        <div className="flex flex-col  h-screen w-screen bg-gradient-to-br from-teal-500 to-blue-900">
            <Navbar />
            <Map />
        </div>
      ):(
        <div>
          <h1 className='text-3xl font-bold text-yellow-600 flex justify-center items-center'>
            Módulo de Autenticación biométrico en la blockchain Ethereum
          </h1>

          <h2 className='text-blue-900 pt-28 font-bold'>
            Welcome pasajero
          </h2>

          <Map />
        </div>
      )
      )}
    </div>
  );
};

export default Home;
