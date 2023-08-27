import React, { useContext, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import PopupForm from './PopupCrearRuta';
import { userContext } from '../context/StateProvider';
import axios from 'axios';


const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 2.4419,
  lng: -76.6063,
};

const Map: React.FC = () => {
  const { state } = useContext(userContext);
  
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [routeData, setRouteData] = useState<any>({});

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

  const generateRouteBack = async (mark : google.maps.LatLngLiteral[], time : number): Promise<void> => {
    try {
      console.log(markers)
      // Realizar la llamada a la API para registrar el usuario en el backend
      const Response = await axios.post(`http://localhost:8080/route/${state.session?.id}/${time}`, mark);
      
      if (Response.status === 200) {
        console.log('Ruta creada:', Response.data);
      } else {
        console.error('Error al creaar ruta');
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  };

  const handleGenerateRoute = () => {
    if (markers.length !== 2) {
        alert('Por favor, seleccione exactamente dos puntos en el mapa: origen y destino.');
        setMarkers([]);
        return;
      }
    
    const [origin, destination] = markers;
  
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
        {
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
            setIsPopupOpen(true);
        } else {
            console.error('Error al generar la ruta:', status);
        }
        }
    );
  };
 
  const handleCancelRoute = () => {

  }

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
        className="py-2 px-4 text-sm bg-red-700 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent">
        Cancelar Ruta
      </button>
      {isPopupOpen && <PopupForm onClose={handlePopupSubmit} />}
    </div>

  </div>
        
  </LoadScript>

  );
};

export default Map;
