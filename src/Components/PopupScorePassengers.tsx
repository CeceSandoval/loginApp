import { useContext, useEffect, useState } from "react";
import { userContext } from "../context/StateProvider";
import { Iuser } from "../@types/user";
import axios from "axios";
import { IRoute } from "../@types/route";

interface PopupScorePassengerProps {
    isOpen: boolean;
    onClose: () => void;
  }

  const StarRating: React.FC<{ starsSelected: number; onStarClick: (rating: number) => void }> = ({
    starsSelected,
    onStarClick,
  }) => {
    const stars = [1, 2, 3, 4, 5];
  
    return (
      <div className="star-rating" style={{alignItems: 'center'}}>
        {stars.map((star) => (
          <span
            key={star}
            className={star <= starsSelected ? 'selected' : ''}
            onClick={() => onStarClick(star)}
            style={{
              fontSize: '24px', // Cambia el tamaño de la estrella
              color: star <= starsSelected ? 'red' : 'black', // Cambia el color de la estrella seleccionada a rojo
              marginRight: '5px' // Agrega margen derecho entre las estrellas
            }}
          >	
          &#9734;
          </span>
        ))}
      </div>
    );
  };

  const PopupScorePassengers: React.FC<PopupScorePassengerProps> = ({ onClose })=> {
  
    const { state } = useContext(userContext);
    const [users, setUsers] = useState<Iuser[]>([]);
    const [ratings, setRatings] = useState(users.map(() => 0));
  
    useEffect(() => {
        fetchUsers();
    }, []); // El segundo argumento [] hace que este efecto se ejecute solo una vez al montar el componente
  
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/get-route/${state.session?.id}`);
            setUsers(response.data.passengers);
        } catch (error) {
            console.error('Error al obtener el user:', error);
        }
    };

    const handleSendClick = () => {
        users.forEach((user, index) => {
          const userId = user.id;
          const score = ratings[index];
    
          axios
            .put(`http://localhost:8080/driver-score/${state.session?.id}/${userId}/${score}`)
            .then((response) => {
              // Manejar la respuesta del servidor si es necesario
            })
            .catch((error) => {
              // Manejar errores si es necesario
            });
        });
    
        onClose();
      };

      const handleStarClick = (index: number, rating: number) => {
        const newRatings = [...ratings];
        newRatings[index] = rating;
        setRatings(newRatings);
      };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Califica a las personas que compartieron el viaje contigo</h2>
        <table className="w-full">
        <thead>
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Calificación</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>
                <StarRating
                  starsSelected={ratings[index]}
                  onStarClick={(rating) => handleStarClick(index, rating)}
                />
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
        <button className="bg-blue-300 hover:bg-gray-400 text-gray-800 px-3 py-1 mt-4 rounded ml-2" onClick={handleSendClick}>Enviar</button>
      </div>
    </div>
    );
  };
  
  export default PopupScorePassengers;