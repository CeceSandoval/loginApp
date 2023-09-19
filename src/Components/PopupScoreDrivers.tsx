import { useContext, useEffect, useState } from "react";
import { userContext } from "../context/StateProvider";
import { Iuser } from "../@types/user";
import axios from "axios";
import { IRoute } from "../@types/route";

interface PopupScoreDriversProps {
    isOpen: boolean;
    onClose: () => void;
    driverId: string;
    driverName: string;
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

  const  PopupScoreDrivers: React.FC<PopupScoreDriversProps> = ({ onClose, driverId, driverName })=> {
    console.log(driverId);
    const { state } = useContext(userContext);
    const [users, setUsers] = useState<Iuser[]>([]);
    const [rating, setRating] = useState(0);
    const [scores, setScores] = useState(0);
    const count: number = 0;
    const [data, setData] = useState<number>();
  
    useEffect(() => {
      fetchUsers();
  }, []); // El segundo argumento [] hace que este efecto se ejecute solo una vez al montar el componente

  const fetchUsers = async () => {
      try {
            const longResponse = await axios.get(`http://localhost:8080/score/count/${us.id}`);
            count.push(longResponse.data);
      } catch (error) {
          console.error('Error al obtener el user:', error);
      }
      setData(count);
  };
    const handleSendClick = () => {
    
          axios
            .put(`http://localhost:8080/score/${state.session?.id}/${driverId}/${rating}`)
            .then((response) => {
              // Manejar la respuesta del servidor si es necesario
            })
            .catch((error) => {
              // Manejar errores si es necesario
            });

        onClose();
      };

      const handleStarClick = (rating: number) => {
        setRating(rating);
        console.log(rating);
      };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Califica a las personas que compartieron el viaje contigo</h2>
        <table className="w-full">
        <thead>
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Cantidad de calificaciones</th>
              <th className="px-4 py-2">Calificación</th>
            </tr>
          </thead>
          <tbody>
         
            <tr >
              <td className="p-2 text-center">{driverName}</td>
              <td className="p-2 text-center">{data}</td>
              <td className="p-2 text-center">
                <StarRating
                  starsSelected={rating}
                  onStarClick={(rating) => handleStarClick(rating)}
                />
              </td>
            </tr>
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
  
  
  export default PopupScoreDrivers;