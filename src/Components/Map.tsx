import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -34.397,
  lng: 150.644,
};

const Map: React.FC = () => {
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

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
        } else {
          console.error('Error al generar la ruta:', status);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCBtOfuiyNgucAZs8gOa3l_BZSNOWTYK7c">
      <div>
        <button onClick={handleGenerateRoute}>Generar Ruta</button>
      </div>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8} onClick={handleClick}>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
        {directions && (
          <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
