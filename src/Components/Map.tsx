import React, { useContext, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import PopupForm from './PopupCrearRuta';
import { userContext } from '../context/StateProvider';
import axios from 'axios';
import { IRoute} from '../@types/route';
import { Iuser } from '../@types/user';
import { toast } from 'react-toastify';
import PopupRoutesPassenger from './PopupRoutesPassenger';


const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 2.4419,
  lng: -76.6063,
};

const Map: React.FC = () => {
  const [route, setRoute] = useState<IRoute>({
    id : null,
    startTime : 0,
    enabled : false,
    driver : {
      type:  {
        id: 0,
      type: ""
      },
      facialId: "",
      name: "",
      email: "",
      identificationNumber: "",
      licensePlate: "",
      carModel: "", 
      qualifying : 0
    },
    passengers : []
  });
  const { state } = useContext(userContext);
  
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [routeData, setRouteData] = useState<any>({});
  const [pasajeros, setPasajeros] = useState<Iuser[]>([]);
  const [showButtons, setShowButtons] = useState(false);
  const [isPopupPassengerOpen, setIsPopupPassengerOpen] = useState(false);
  const [popupRoute, setPopupRoute] = useState<IRoute>();

  const handleClick = (event: google.maps.MapMouseEvent) => {
    const newMarker: google.maps.LatLngLiteral = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkers([...markers, newMarker]);
  };

  const handlePopupSubmit = (formData: any) => {
    setRouteData(formData);
    setIsPopupOpen(false); // Cierra el popup
    console.log(markers)
    generateRouteBack(markers, formData);
  };

  const handlePopupPassengerSubmit = () => {
    setIsPopupPassengerOpen(false);
  }

  const generateRouteBack = async (mark : google.maps.LatLngLiteral[], time : number): Promise<void> => {
    try {
      console.log(markers)
      // Realizar la llamada a la API para registrar el usuario en el backend
      const Response = await axios.post(`http://localhost:8080/route/${state.session?.id}/${time}`, mark);
      setShowButtons(true);
      if (Response.status === 200) {
        console.log('Ruta creada:', Response.data);
        setRoute(prevRoute => ({ ...prevRoute, ...Response.data }));
      } else {
        console.error('Error al creaar ruta');
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  };

  const handleGenerateRoute = () => {
    if (markers.length < 2) {
      alert('Por favor, seleccione al menos dos puntos en el mapa.');
      
      return;
    }
    
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: markers[0],
        destination: markers[markers.length - 1],
        waypoints: markers.slice(1, markers.length - 1).map(marker => ({ location: marker })),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setIsPopupOpen(true)
        } else {
          console.error('Error al generar la ruta:', status);
        }
      }
    );
  };
 
  const handleCancelRoute = async (): Promise<void> => {
    try {
      const Response = await axios.delete(`http://localhost:8080/route/${state.session?.id}/${route.id}`);
      
      if (Response.status === 200) {
        console.log('Ruta eliminada:', Response.data);
        setMarkers([]);
        setDirections(null);
        setShowButtons(false);
      } else {
        console.error('Error al eliminar ruta');
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  };

    const obtenerRuta =async () => {
      try {
        const response = await axios.get(`http://localhost:8080/get-route/${state.session?.id}`);
        console.log("ObtenerRuta" + JSON.stringify(response.data));
        setRoute(response.data);
      } catch (error) {
        toast.warning("Aún no has creado una ruta",  {
          autoClose: 4000,
      });
      }
    }

    const cargarPasajeros = async () => {
      setShowButtons(true);
      setIsPopupPassengerOpen(true);
      setPopupRoute(route);
    };

  return (
  
  <LoadScript googleMapsApiKey="AIzaSyCBtOfuiyNgucAZs8gOa3l_BZSNOWTYK7c">
  <div className="flex flex-col h-screen">
    <div className="mr-5 ml-5  w-95 h-70vh mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <GoogleMap mapContainerStyle={{ ...containerStyle, width: '100%' }} center={center} zoom={14} onClick={handleClick}>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
        {directions && (
          <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />
        )}
      </GoogleMap>
    </div>

    <div className="mt-4 flex justify-between mx-4">
      <button
        className="py-2 px-4 text-sm bg-blue-900 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent"
        onClick={handleGenerateRoute}>
        Generar Ruta
        
      </button>

      <button
        className={`py-2 px-4 text-sm bg-green-700 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent ${showButtons? 'block': 'hidden'}`}
        onClick={cargarPasajeros}>
        Solicitudes de pasajeros
      </button>

      <button
        className={`py-2 px-4 text-sm bg-red-700 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent ${showButtons? 'block': 'hidden'}`}
        onClick={handleCancelRoute}>
        Cancelar Ruta
      </button>
      {isPopupOpen && <PopupForm onClose={handlePopupSubmit} />}
      {isPopupPassengerOpen && <PopupRoutesPassenger onClose={handlePopupPassengerSubmit} isOpen={true} route={route} />}
    </div>

  </div>
        
  </LoadScript>

  );
};

export default Map;
