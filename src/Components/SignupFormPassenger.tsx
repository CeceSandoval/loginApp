import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Iuser} from '../@types/user';


const SignupSchema = yup
  .object({
    typeId: yup.number().required(),
    facialId: yup.string().required(),
    name: yup.string().required(),
    email: yup.string().required(),
    identificationNumber: yup.string().required(),
    licensePlate: yup.string().required(),
    carModel: yup.string().required(),
  })
  .required();

const SignupFormPassenger = () => {
  let faceio: any;
  useEffect(() => {
    faceio = new faceIO('fioa7a55');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Iuser>({
    resolver: yupResolver(SignupSchema),
  });

  //create  a submit function that will submit the data
  const onSubmit = (data: Iuser) => {
    alert(JSON.stringify(data));

    handleSignUp(data);
  };

  //create a signup function that will submit the data to faceIO by calling the function faceIO enroll
  const handleSignUp = async (Iuser: Iuser): Promise<any> => {
    try {
      let response: any = await faceio.enroll({
        locale: 'auto',
        payload: {
          typeId: 2,
          facialId: `${Iuser.facialId}`,
          name: `${Iuser.name}`,
          email: `${Iuser.email}`,
          identificationNumber:`${Iuser.identificationNumber}`,
          licensePlate: null,
          carModel: null,
        },
      });
      alert(
        ` ID Unico a almacenar en BC: ${response.facialId}
      Fecha de registro: ${response.timestamp}
      género: ${response.details.gender}
      edad aproximada: ${response.details.age}
      payload: ${JSON.stringify(response.details)}`
      );
    } catch (error) {
      alert('Ya te has registrado con este email');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-br from-teal-500 to-blue-900">
      <h1 className="text-3xl font-bold text-white mb-8">LoginAPP Registro Pasajero</h1>

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
            {...register('name')}
            className='w-full px-4 py-3 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-800'
          />
          {errors.name && <p className='text-red-700'>{errors.name.message}</p>}
        </div>
        <div>
          <label
            htmlFor='identificationNumber'
            className='text-lg font-bold text-white block mb-1'
          >
            Número de identificación
          </label>
          <input
            id='identificationNumber'
            type='text'
            placeholder='Ingrese su número de indentificación'
            {...register('identificationNumber')}
            className='w-full px-4 py-3 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-800'
          />
          {errors.identificationNumber && (
            <p className='text-red-700'>{errors.identificationNumber.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor='email'
            className='text-lg font-bold text-white block mb-1'
          >
            Correo electrónico
          </label>
          <input
            id='email'
            type='text'
            placeholder='Ingrese su correo electrónico'
            {...register('email')}
            className='w-full px-4 py-3 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-800'
          />
          {errors.email && (
            <p className='text-red-700'>{errors.email.message}</p>
          )}
        </div>

       
        <div>
          <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out">
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupFormPassenger;
