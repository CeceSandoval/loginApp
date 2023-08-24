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
        <div >
            <h2>Lista de Usuarios Pasajeros:</h2>
            <div  style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white',  width: '100%'}}>
            <table style={{ width: '90%', overflowY: 'auto', backgroundColor: 'gray' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid gray', padding: '8px', textAlign: 'center'}}>Nombre de Usuario</th>
                        <th style={{ border: '1px solid gray', padding: '8px', textAlign: 'center' }}>Correo</th>
                        <th style={{ border: '1px solid gray', padding: '8px', textAlign: 'center' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td style={{ textAlign: 'center' }}>{user.name}</td>
                            <td style={{ textAlign: 'center' }}>{user.email}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button onClick={() => handleToggleUser(user.id, !user.enabled)}>
                                    {user.enabled ? 'Deshabilitar' : 'Habilitar'}
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