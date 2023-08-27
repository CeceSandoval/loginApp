import React, { useContext, useState } from 'react';
import Map from '../Components//Map';
import { userContext } from '../context/StateProvider';
import axios from 'axios';
import { actionTypes } from '../helpers/Reducers';

const NavbarPassenger = () => {
  const { state } = useContext(userContext)
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(userContext);

  const closeSession = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Realizar la llamada a la API para registrar el usuario en el backend
      const Response = await axios.delete(`http://localhost:8080/delete-session/${state.session?.id}`);
      
      if (Response.status === 200) {
        dispatch({ type: actionTypes.SET_SESSION, session: null});
        window.location.href = '/';
        console.log('Sesión cerrada:', Response.data);
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  };
  return (
    
    <nav className="flex items-center justify-between flex-wrap blue-900 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg
          className="fill-current h-8 w-8 mr-2"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <span className="font-semibold text-xl tracking-tight">GoToguether</span>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
        <button
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            onClick={closeSession} disabled={isLoading}>
            Perfil
          </button>
        </div>
        <div>
          <button
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            onClick={closeSession} disabled={isLoading}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPassenger;
    



