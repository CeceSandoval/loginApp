import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context/StateProvider";
import { actionTypes } from "../helpers/Reducers";
import axios, { AxiosResponse } from 'axios';
import { Issesion } from "../@types/session";
import { Iuser } from "../@types/user";

const Login = () => {
  //we load faceIO using a useEffect hook

  let faceio: any;
  useEffect(() => {
    faceio = new faceIO("fioa7a55");
  }, []);

  //we use a useContext hook dispatch to be able to dispatch our user to the state
  const { dispatch } = useContext(userContext);

  //we set up the handle login function
  const handleLogin = async () => {
    try {
      let response = await faceio.authenticate({
        locale: "auto",
      });
      alert(`
                Has sido identificado exitosamente
                ID Facial Único: ${response.facialId}
                Data: ${JSON.stringify(response.payload)}
          `);

      
      alert("Has iniciado sesión exitosamente");
      console.log(response.payload);
      
      handleLoginBack(response.facialId);

    } catch (error) {
      console.log(error);
      alert(
        "No se pudo iniciar sesión, por favor actualiza y vuelve a intentarlo"
      );
    }
  };

  const handleLoginBack = async (userId : string): Promise<void> => {
    try {
      // Realizar la llamada a la API para registrar el usuario en el backend
      const Response = await axios.post(`http://localhost:8080/create-session/${userId}`);
      console.log("Datos de respuesta del back: "+ JSON.stringify(Response))
      const data : Issesion = {
        id: Response.data.id,
        userId: Response.data.userId,
        userType: Response.data.userType,
      }
      if (Response.status === 200) {
        dispatch({ type: actionTypes.SET_SESSION, session: data});
        console.log('Sesión iniciada:', Response.data);
      } else {
        console.error('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }

  };

  return (

  <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-br from-teal-500 to-blue-900">
    <h1 className="text-3xl font-bold text-white mb-4">LoginAPP</h1>
    <button onClick={handleLogin} className="px-8 py-3 bg-teal-500 text-white rounded-md text-sm shadow-lg hover:bg-teal-600 transition duration-300 ease-in-out mb-4">
        Iniciar Sesión
    </button>

    <div className="text-white">
      <p>
        ¿Aún no tienes una cuenta? Regístrate como: {" "}
        <div className="flex justify-center">
          <Link
            to="/signup"
            className="text-teal-500 hover:text-teal-600 transition duration-300 ease-in-out mr-2"
          >
            Conductor
          </Link>
          <Link
            to="/signupPassenger"
            className="text-teal-500 hover:text-teal-600 transition duration-300 ease-in-out"
          >
            Pasajero
          </Link>
        </div>
      </p>
    </div>

    <div className="text-white mt-10 text-xs">
        <p>
          Iniciar sesión como {" "}
          <Link
            to="/admin"
            className="text-teal-500 hover:text-teal-600 transition duration-300 ease-in-out"
          >
            Administrador
          </Link>
        </p>
      </div>


</div>


  );
};

export default Login;