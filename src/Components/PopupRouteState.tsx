import { useContext, useEffect, useState } from "react";
import { userContext } from "../context/StateProvider";
import { Iuser } from "../@types/user";
import axios from "axios";
import { string } from "yup";

interface PopupRouteStateProps {
    isOpen: boolean;
    onClose: () => void;
    travelId: any;
  }
  const PopupRouteState: React.FC<PopupRouteStateProps> = ({ isOpen, onClose, travelId })=> {
  
    const { state } = useContext(userContext);
    const [estado,setEstado]= useState("");
    const TravelState = async() => {
        try {
          const response = await axios.get(`http://localhost:8080/travel/state/${state.session?.id}/${travelId}`);
          setEstado(String(response.data));
        } catch (error) {
          console.error('Error al traer el estado de la ruta:', error);
        }
      }
    
      useEffect(() => {
        if (isOpen) {
          // Si el popup está abierto, ejecutar las funciones
          TravelState();
        }
      }, [isOpen]); // Se ejecutará cuando isOpen cambie

    return (
        
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6">
        {/* <h2 className="text-xl font-semibold mb-4">Info del viaje:
        <pre>{JSON.stringify(travelInfo, null, 2)}</pre>
        </h2> */}
        <h2 className="text-xl font-semibold mb-4">Estado del viaje:
                
        </h2>
        <h2 className="text-xl font-bold mb-4">{estado}
                
        </h2>
                
                
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
  
  export default PopupRouteState;
  