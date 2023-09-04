import { useContext, useEffect, useState } from "react";
import { userContext } from "../context/StateProvider";
import { Iuser } from "../@types/user";
import axios from "axios";
import { IRoute } from "../@types/route";

interface PopupRoutesPassengerProps {
    isOpen: boolean;
    onClose: () => void;
    route: IRoute;
  }
  const PopupRoutesPassenger: React.FC<PopupRoutesPassengerProps> = ({ onClose, route })=> {
  
    const { state } = useContext(userContext);
    const [users, setUsers] = useState<Iuser[]>([]);
  
    useEffect(() => {
        fetchUsers();
    }, []); // El segundo argumento [] hace que este efecto se ejecute solo una vez al montar el componente
  
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/route/passengers/${state.session?.id}/${route.id}`)
            setUsers(response.data);
        } catch (error) {
            console.error('Error al obtener el user:', error);
        }
    };

    const addUserToRoute = async(userToAdd: Iuser) => {
      try {
        const response = await axios.put(`http://localhost:8080/add-passenger-route/${state.session?.id}/${route.id}`, userToAdd);
        fetchUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
    
    const deleteUserFromRoute = async(userToDelete: Iuser) => {
      try {
        const response = await axios.put(`http://localhost:8080/delete-passenger/${state.session?.id}/${route.id}`, userToDelete);
        fetchUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Agregar usuarios a viaje:</h2>
        <table className="w-full">
        <thead>
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Calificación</th>
              <th className="px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.qualifying}</td>
                <td>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => addUserToRoute(user)} // Aquí llama a tu función para agregar usuarios a la ruta
                  >
                    ✓
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => deleteUserFromRoute(user)} // Aquí llama a tu función para agregar usuarios a la ruta
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  
  export default PopupRoutesPassenger;
  