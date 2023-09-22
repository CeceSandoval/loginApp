import { useForm } from "react-hook-form";
import { Admin } from "../@types/admin";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import { userContext } from "../context/StateProvider";
import { useContext } from "react";
import { actionTypes } from "../helpers/Reducers";
import { Issesion } from "../@types/session";

const AdminLogin = () => {
  const { dispatch } = useContext(userContext);
    const SignupSchema = yup
    .object({
      userName: yup.string().required(),
      password: yup.string().required(),
    })
    .required();


    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<Admin>({
        resolver: yupResolver(SignupSchema),
      });

      const onSubmit = (data: Admin) => {
        handleSignUp(data);
      };

      const handleSignUp = async (userData: Admin): Promise<void> => {
        try {
            // Realizar la llamada a la API para registrar el usuario en el backend
            const response = await axios.post(`http://localhost:8080/create-session/admin/${userData.userName}/${userData.password}`);
            const data : Issesion = {
              id: response.data.id,
              userId: response.data.userId,
              userType: response.data.userType,
            }
            console.log("Responde" + response)
            //dispatch({ type: actionTypes.SET_SESSION, session: data});
            if (response.status === 200) {
              dispatch({ type: actionTypes.SET_SESSION, session : data});
              console.log('Usuario registrado exitosamente en el backend:', response.data);
            } else {
              console.error('Error al registrar usuario en el backend');
            }
          } catch (error) {
            alert("No se pudo iniciar sesión. Vuelve a intentarlo");
          }
      }

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-br from-teal-500 to-blue-900">
        <h1 className="text-3xl font-bold text-white mb-8">Ingreso de administrador</h1>
        <form className='w-full max-w-md space-y-6' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor='name'
            className='text-lg font-bold text-white block mb-1'
          >
            Nombre
          </label>
          <input
            id='name'
            type='text'
            placeholder='Ingrese su nombre'
            {...register('userName')}
            className='w-full px-4 py-3 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-800'
          />
          {errors.userName && <p className='text-red-700'>{errors.userName.message}</p>}
        </div>
        <div>
          <label
            htmlFor='password'
            className='text-lg font-bold text-white block mb-1'
          >
            Contraseña
          </label>
          <input
            id='password'
            type='password'
            placeholder='Ingrese la contraseña'
            {...register('password')}
            className='w-full px-4 py-3 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-800'
          />
          {errors.password && (
            <p className='text-red-700'>{errors.password.message}</p>
          )}
        </div>
        <div>
          <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out">
            Iniciar sesión
          </button>
        </div>
        </form>
    </div>

    );
};

export default AdminLogin;