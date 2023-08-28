import React, { useState, useEffect, useContext } from 'react';
import { userContext } from "../context/StateProvider";
import { Iuser } from "../@types/user";
import axios from 'axios';


interface PopupPassengerProps {
  onClose: () => void;
  //sessionId: string | undefined;
}
const PopupPassenger: React.FC<PopupPassengerProps> = ({ onClose })=> {

  const { state } = useContext(userContext);
  const [users, setUsers] = useState<Iuser[]>([]);

  useEffect(() => {
      console.log("get users" + state)
      fetchUsers();
  }, []); // El segundo argumento [] hace que este efecto se ejecute solo una vez al montar el componente

  const fetchUsers = async () => {
      try {
          const response = await axios.get(`http://localhost:8080/passenger/${state.session?.id}`)
          setUsers(response.data);
      } catch (error) {
          console.error('Error al obtener el user:', error);
      }
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Perfil</h2>
        {users ? (
          <div>
            <p><strong>Nombre:</strong> {users.name}</p>
            <p><strong>Identificación:</strong> {users.identificationNumber}</p>
            <p><strong>Correo:</strong> {users.email}</p>
            <p><strong>Calificación:</strong> {users.qualifying}</p>
          </div>
        ) : (
          <p>Cargando información del conductor...</p>
        )}
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 mt-4 rounded"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PopupPassenger;
