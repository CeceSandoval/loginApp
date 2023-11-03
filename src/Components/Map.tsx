import React, { useContext, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import PopupForm from './PopupCrearRuta';
import { userContext } from '../context/StateProvider';
import axios from 'axios';
import { IRoute} from '../@types/route';
import { Iuser } from '../@types/user';
import { toast } from 'react-toastify';
import PopupRoutesPassenger from './PopupRoutesPassenger';
import PopupScorePassengers from './PopupScorePassengers';


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
  const [driver, setdriver] = useState<Iuser>();
  const [showButtons, setShowButtons] = useState(false);
  const [isPopupPassengerOpen, setIsPopupPassengerOpen] = useState(false);
  const [popupRoute, setPopupRoute] = useState<IRoute>();
  const [isPopupScoreOpen, setIsPopupScorePassengerOpen] = useState(false);
  const [routeGenerated, setRouteGenerated] = useState(false);
  const [timeRoute, setTimeRoute] = useState<number>();

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

  const handlePopupScorePassengerSubmit = () => {
    setIsPopupScorePassengerOpen(false);
    handleCancelRoute();
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
        setTimeRoute(time);
      } else {
        console.error('Error al creaar ruta');
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  };

  const handleGenerateRoute = () => {
    console.log(markers)
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
            setIsPopupOpen(true);
          
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
        setTimeRoute(0);
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
        setdriver(response.data.driver)
        if(response.data.id === null) {

        } else {
          setRoute(response.data);
          setMarkers(response.data.points);
          setShowButtons(true);
          setRouteGenerated(true);
          //handleGenerateRoute();
        }
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

    const finalizarViaje = async () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if(timeRoute > currentTimestamp) {
        alert("No puedes finalzar un viaje que aún no ha empezado. Intenta cancelarlo");
      } else {
        setShowButtons(true);
        setIsPopupScorePassengerOpen(true);
      }
    };

    useEffect(() => {
      obtenerRuta(); // Llama a obtenerRuta una vez al montar el componente
    }, []);

  return (
  
  <LoadScript googleMapsApiKey="GOOOGLEAPIKEYEEYEYEYEKEY">
    <div>
    </div>
  <div className="flex flex-col h-screen">
    <h2 style={{marginLeft: '20px'}} > Bienvenido conductor {driver?.name} </h2>
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
        className={`py-2 px-4 text-sm bg-pink-700 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent ${showButtons? 'block': 'hidden'}`}
        onClick={finalizarViaje}>
        Finalizar viaje
      </button>

      <button
        className={`py-2 px-4 text-sm bg-red-700 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent ${showButtons? 'block': 'hidden'}`}
        onClick={handleCancelRoute}>
        Cancelar Ruta
      </button>
      {isPopupOpen && <PopupForm onClose={handlePopupSubmit} />}
      {isPopupPassengerOpen && <PopupRoutesPassenger onClose={handlePopupPassengerSubmit} isOpen={true} route={route} />}
      {isPopupScoreOpen && <PopupScorePassengers onClose={handlePopupScorePassengerSubmit} isOpen={true}/>}
    </div>

  </div>
        
  </LoadScript>

  );
};

export default Map;
