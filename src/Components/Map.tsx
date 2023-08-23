import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import PopupForm from './PopupCrearRuta';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 2.4419,
  lng: -76.6063,
};

const Map: React.FC = () => {
  
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClick = (event: google.maps.MapMouseEvent) => {
    const newMarker: google.maps.LatLngLiteral = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkers([...markers, newMarker]);
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
      {isPopupOpen && <PopupForm onClose={() => setIsPopupOpen(false)} />}
    </div>

  </div>
        
  </LoadScript>

  );
};

export default Map;
