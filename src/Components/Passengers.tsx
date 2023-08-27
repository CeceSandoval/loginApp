import { useContext, useEffect, useState } from "react";
import { userContext } from "../context/StateProvider";
import axios from "axios";
import uuid from 'uuid';
import { Iuser } from "../@types/user";

const Passengers = () => {
    const { state } = useContext(userContext);
    const [users, setUsers] = useState<Iuser[]>([]);

    useEffect(() => {
        console.log("get users" + state)
        fetchUsers();
    }, []); // El segundo argumento [] hace que este efecto se ejecute solo una vez al montar el componente

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/passengers/${state.session?.id}`)
            setUsers(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de usuarios:', error);
        }
    };

    const handleToggleUser = async (userId: uuid, enable: boolean) => {
        try {
            await axios.put(`http://localhost:8080/change-state/${state.session?.id}/${userId}/${enable}`);
            fetchUsers();
        } catch (error) {
            console.error('Error al habilitar/deshabilitar el usuario:', error);
        }
    };
    return (
      <div className="bg-gradient-to-br from-teal-500 to-blue-900 p-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          Lista de Usuarios Pasajeros
        </h2>
        <div className="flex flex-col bg-white p-4 rounded-lg w-full">
          <table className="w-full overflow-y-auto">
            <thead>
              <tr className="bg-gray-300">
                <th className="border p-2 text-center">Nombre de Usuario</th>
                <th className="border p-2 text-center">Correo</th>
                <th className="border p-2 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border">
                  <td className="p-2 text-center">{user.name}</td>
                  <td className="p-2 text-center">{user.email}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleToggleUser(user.id, !user.enabled)}
                      className={`text-${
                        user.enabled ? "red" : "green"
                      } py-1 px-3 rounded`}
                    >
                      {user.enabled ? "Deshabilitar" : "Habilitar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default Passengers;