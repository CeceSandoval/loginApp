import { useContext } from 'react';
import Login from '../Components/Login';
import { userContext } from '../context/StateProvider';

const Home = () => {
  const { state } = useContext(userContext);

  return (
    <div className='min-h-screen flex flex-col '>
      {!state?.user ? (
        <Login />
      ) : (
        <div>
          <h1 className='text-3xl font-bold text-yellow-600 flex justify-center items-center'>
            Módulo de Autenticación biométrico en la blockchain Ethereum
          </h1>

          <h2 className='text-blue-900 pt-28 font-bold'>
            Welcome {state.user.name} Email:{state.user.email}
          </h2>
        </div>
      )}
    </div>
  );
};

export default Admin;
