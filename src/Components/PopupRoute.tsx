import React, { useState, useEffect, useContext } from 'react';
import { userContext } from "../context/StateProvider";
import axios from 'axios';

interface PopupRouteProps {
  onClose: () => void;
  drivers: any;
  passengerId: string;
  routeId: any;
}

const PopupRoute: React.FC<PopupRouteProps> = ({ onClose, drivers, passengerId, routeId }) => {

  const onChooseRoute = async (): Promise<void> => {
    try {
      const Response = await axios.put(`http://localhost:8080/passenger/select-route/${passengerId}/${routeId.id}`);
      if (Response.status === 200) {
        alert('Ruta seleccionada con éxito, recuerde revisar el estado solicitud de su ruta')
      }
    } catch (error) {
      console.error('Hubo un error al seleccionar la ruta', error);
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">¿Quieres compartir esta ruta?</h2>
        <h3>Información del conductor:</h3>
            <ul>
              <li>
                <strong>Nombre:</strong> {drivers.name}
              </li>
              <li>
                <strong>Correo Electrónico:</strong> {drivers.email}
              </li>
              <li>
                <strong>Placa de Vehículo:</strong> {drivers.licensePlate}
              </li>
              <li>
                <strong>Modelo de Vehículo:</strong> {drivers.carModel}
              </li>
            </ul>

        <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 mt-4 rounded"
            onClick={onClose}
            >
            Cerrar
        </button>
        <button
            className="bg-green-300 hover:bg-gray-400 text-gray-800 px-3 py-1 mt-4 rounded"
            onClick={onChooseRoute}
            >
            Aceptar Ruta
        </button>
          </div>
        

        
      </div>
  );
}

export default PopupRoute;

