import React, { useContext, useState, useEffect} from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import PopupForm from './PopupCrearRuta';
import { userContext } from '../context/StateProvider';
import axios from 'axios';
import { IRoute } from '../@types/route';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { string } from 'yup';
import Driver from '../pages/Driver';
import PopupRouteState from './PopupRouteState';
import PopupScoreDrivers from './PopupScoreDrivers';
import Drivers from './Drivers';
import Passenger from '../pages/Passenger';
import { Iuser } from '../@types/user';


const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 2.4419,
  lng: -76.6063,
};

type LatLngPoint = {
  lat: number;
  lng: number;
};
interface MapProps {
  onRouteClick: () => void;
  setDrivers: (drivers: any) => void;
  setIds: (ids: any) => void;
}
const MapPassenger: React.FC<MapProps> = ({ onRouteClick, setDrivers, setIds  }) => {
  const { state } = useContext(userContext);
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
    passengers : [], 
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/passenger/${state.session?.id}`)
      .then(response => {
        // Accede a los datos dentro de AxiosResponse usando response.data
        const { name } = response.data;
        console.log(name);
        setPassengerName(name); // Actualiza el nombre del pasajero
      })
      .catch(error => {
        console.error("Error al obtener el nombre del pasajero:", error);
      });
  }, []);

  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [passengerName, setPassengerName] = useState("");
  const [routeData, setRouteData] = useState<any>({});
  const [ruta, setRuta] = useState<any>({});
  const [routeId,setRouteId]= useState(string);
  const [travelId,setTravelId]= useState(string);
  const [driverId,setDriverId]= useState("");
  const [driverName,setDriverName]= useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupRouteStateOpen, setIsPopupRouteStateOpen] = useState(false);
  const [isPopupScoreDriverOpen, setIsPopupScoreDriverOpen] = useState(false);
  const [showButtons, setShowButtons] = useState(false); 
  const [showButtonState, setShowButtonState] = useState(false); 
  const [showRoute1, setShowRoute1] = useState(false); 
  const [showRoute2, setShowRoute2] = useState(false); 
  const [showRoute3, setShowRoute3] = useState(false); 
  const [showRoute4, setShowRoute4] = useState(false);
  const [driversArray, setDriversArray] = useState<any[]>([]); // Definir el estado para drivers
  const [idsArray, setIdsArray] = useState<any[]>([]); // Definir el estado para ids routes
  interface PopupRouteProps {
    onRouteClick: () => void;
  }

  showRoute1

  const handleClick = (event: google.maps.MapMouseEvent) => {
    const newMarker: google.maps.LatLngLiteral = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkers([...markers, newMarker]);
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
            setIsPopupOpen(true)
        } else {
            console.error('Error al generar la ruta:', status);
        }
        }
    );
  };

  const handlePopupSubmit = (formData: any) => {
    setRouteData(formData);
    setIsPopupOpen(false); // Cierra el popup
    generateRouteBack(markers, formData);
  };

  const generateRouteBack = async (mark : google.maps.LatLngLiteral[], time : number): Promise<void> => {
    try {
      // Realizar la llamada a la API para registrar el usuario en el backend
      const Response = await axios.post(`http://localhost:8080/travel/${state.session?.id}/${time}`, mark); //
      
      if (Response.status === 200) {
        console.log('Ruta creada:', Response.data);

        setTravelId(Response.data.id)<
        setRoute(prevRoute => ({ ...prevRoute, ...Response.data }));
        const routeId = Response.data.id;
        findRoutes(routeId);
      } else {
        console.error('Error al crear viaje');
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  };
  
  const findRoutes = async (routeId: any) => {
    console.log(routeId);
    try {
      const Response = await axios.get(`http://localhost:8080/passenger/routes/${state.session?.id}/${routeId}`);
      if (Response.status === 200) {
        const routes = Response.data;
        const length = routes.length;
        console.log(JSON.stringify(Response.data));
        if (length > 0) {
          setShowButtons(true);
          setShowButtonState(true);
          setShowRoute1(true);
          
          const Ids: any[] = [];
          const rutas: any[] = [];
          const drivers: any[] = [];
  
          for (let i = 0; i < length; i++) {
            // Obtener puntos para cada ruta
            const points = Response.data[i].points.map((mark: any) => ({
              lat: mark.lat,
              lng: mark.lng
            }));
            rutas.push(points);
  
            // Obtener información del conductor para cada ruta
            const driver = {
              id: Response.data[i].driver.id,
              name: Response.data[i].driver.name,
              email: Response.data[i].driver.email,
              licensePlate: Response.data[i].driver.licensePlate,
              carModel: Response.data[i].driver.carModel
            };
            drivers.push(driver);

            const idss= {
              id: Response.data[i].id
            };
            Ids.push(idss);
          }
          // Mostrar las rutas según la cantidad disponible
          if (length > 1) {
            setShowRoute2(true);
          }
          if (length > 2) {
            setShowRoute3(true);
          }
          if (length > 3) {
            setShowRoute4(true);
          }
  

          setRuta(rutas)
          setDrivers(drivers[0]);
          setDriversArray(drivers);
          setIdsArray(Ids);
          setIds(Ids[0]);

          console.log('Ids:', Ids);
          console.log('Rutas:', rutas);
          console.log('drivers:', drivers);
          
        } else {
          alert('Lo sentimos, no hay rutas disponibles');
        }
      } else {
        toast.error('Lo sentimos, no hay rutas disponibles', {
          autoClose: 4000
        });
      }
    } catch (error) {
      console.error('Error al encontrar rutas:', error);
    }
  };

    const onRenderRoute1 = async (): Promise<void> => {

          setDrivers(driversArray[0]);
          setIds(idsArray[0]);
          setDriverName(driversArray[0].name);
          setDriverId(driversArray[0].id);
          const combinedRoute = ruta[0].map((point:any) => ({
            location: new google.maps.LatLng(point.lat, point.lng),
            stopover: true
          }));
  
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: combinedRoute[0].location,
              destination: combinedRoute[combinedRoute.length - 1].location,
              waypoints: combinedRoute.slice(1, -1), // Excluye el origen y el destino
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
      }
      const onRenderRoute2 = async (): Promise<void> => {

        setDrivers(driversArray[1]);
        setIds(idsArray[1]);
        setDriverName(driversArray[1].name);
        setDriverId(driversArray[1].id);
        setMarkers(ruta[1]);
        const combinedRoute = ruta[1].map((point:any) => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          stopover: true
        }));

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: combinedRoute[0].location,
            destination: combinedRoute[combinedRoute.length - 1].location,
            waypoints: combinedRoute.slice(1, -1), // Excluye el origen y el destino
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
    }
    const onRenderRoute3 = async (): Promise<void> => {

      setDrivers(driversArray[2]);
      setIds(idsArray[2]);
      setDriverName(driversArray[2].name);
      setDriverId(driversArray[2].id);
      setMarkers(ruta[2]);
      const combinedRoute = ruta[2].map((point:any) => ({
        location: new google.maps.LatLng(point.lat, point.lng),
        stopover: true
      }));

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: combinedRoute[0].location,
          destination: combinedRoute[combinedRoute.length - 1].location,
          waypoints: combinedRoute.slice(1, -1), // Excluye el origen y el destino
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
  }
  const onRenderRoute4 = async (): Promise<void> => {

    
    setDrivers(driversArray[3]);
    setIds(idsArray[3]);
    setDriverName(driversArray[3].name);
    setDriverId(driversArray[3].id);
    setMarkers(ruta[3]);
    const combinedRoute = ruta[3].map((point:any) => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      stopover: true
    }));

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: combinedRoute[0].location,
        destination: combinedRoute[combinedRoute.length - 1].location,
        waypoints: combinedRoute.slice(1, -1), // Excluye el origen y el destino
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
}
const onRenderMyTravel = async (): Promise<void> => {
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
        } else {
            console.error('Error al generar la ruta:', status);
        }
        }
    );
}
const routeState = async (): Promise<void> => {
  setIsPopupRouteStateOpen(true);
};

const handleCancelRoute = async (): Promise<void> => {
    try {
      const Response = await axios.delete(`http://localhost:8080/travel/${state.session?.id}/${route.id}`); ///passenger/routes/{sessionId}/{routeId}
      if (Response.status === 200) {
        console.log('Ruta eliminada:', Response.data);
        setMarkers([]);
        setDirections(null);
        setShowButtons(false);
        setShowButtonState(false);
        setShowRoute1(false);
        setShowRoute2(false);
        setShowRoute3(false);
        setShowRoute4(false);
      } else {
        console.error('Error al eliminar ruta');
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  };
  const handlePopupRouteStateSubmit = () => {
    setIsPopupRouteStateOpen(false);
  }
  const handlePopupScoreDriverSubmit = () => {
    setIsPopupScoreDriverOpen(false);
    handleCancelRoute();
  }

  const finalizarViaje = async () => {
    setShowButtons(true);
    setIsPopupScoreDriverOpen(true);

  };

  return (
  
  <LoadScript googleMapsApiKey="AIzaSyCBtOfuiyNgucAZs8gOa3l_BZSNOWTYK7c">
  <div className="flex flex-col h-screen">
  <h2 style={{marginLeft: '20px'}} > Bienvenido Pasajero {passengerName} </h2>
  <div className={`mr-5 ml-5 w-95 mx-auto mt-8 p-4 bg-white rounded-lg shadow-md ${directions ? 'narrowMap' : ''}`}>
    <div className="flex"> {/* Nuevo div para los botones */}
      <GoogleMap mapContainerStyle={{ ...containerStyle, width: showButtons ? '90%' : '100%' }} center={center} zoom={14} onClick={handleClick}>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
        {directions && (
          <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />
        )}

      </GoogleMap>

      <div className={`mt-4 flex flex-col mx-4 ${showButtons ? 'block' : 'hidden'}`}>
          <button className={`relative  my-2 py-2 px-4 text-sm bg-blue-500 text-white rounded hover:bg-white hover:text-green-500 border border-white hover:border-transparent`} onClick={onRenderMyTravel}>
            Tus Ubicaciones
          </button>
        <h1 className='bold'>Rutas Disponibles</h1>
        <div className={`flex items-center ${showRoute1 ? 'block' : 'hidden'}`}>  {/* Contenedor para alinear los botones horizontalmente */}
          <button className={`relative  my-2 py-2 px-4 text-sm bg-blue-500 text-white rounded hover:bg-white hover:text-green-500 border border-white hover:border-transparent`} onClick={onRenderRoute1}>
            Ruta1
          </button>
          <button className="ml-2 bg-transparent hover:bg-transparent" onClick={onRouteClick}>
            <span className="text-xl">&#128269;</span> {/* Tamaño del icono de lupa */}
          </button>
        </div>
        <div className={`flex items-center ${showRoute2 ? 'block' : 'hidden'}`}> {/* Contenedor para alinear los botones horizontalmente */}
          <button className={`relative ${showRoute2 ? 'block' : 'hidden'} my-2 py-2 px-4 text-sm bg-blue-500 text-white rounded hover:bg-white hover:text-green-500 border border-white hover:border-transparent`} onClick={onRenderRoute2}>
            Ruta2
          </button>
          <button className="ml-2 bg-transparent hover:bg-transparent" onClick={onRouteClick}>
            <span className="text-xl">&#128269;</span> {/* Tamaño del icono de lupa */}
          </button>
        </div>
        <div className={`flex items-center ${showRoute3 ? 'block' : 'hidden'}`}> {/* Contenedor para alinear los botones horizontalmente */}
          <button className={`relative ${showRoute3 ? 'block' : 'hidden'} my-2 py-2 px-4 text-sm bg-blue-500 text-white rounded hover:bg-white hover:text-green-500 border border-white hover:border-transparent`} onClick={onRenderRoute3}>
            Ruta3
          </button>
          <button className="ml-2 bg-transparent hover-bg-transparent" onClick={onRouteClick}>
            <span className="text-xl">&#128269;</span> {/* Tamaño del icono de lupa */}
          </button>
        </div>
        <div className={`flex items-center ${showRoute4 ? 'block' : 'hidden'}`}>  {/* Contenedor para alinear los botones horizontalmente */}
          <button className={`relative ${showRoute4 ? 'block' : 'hidden'} my-2 py-2 px-4 text-sm bg-blue-500 text-white rounded hover:bg-white hover:text-green-500 border border-white hover:border-transparent`} onClick={onRenderRoute4}>
            Ruta4
          </button>
          <button className="ml-2 bg-transparent hover:bg-transparent" onClick={onRouteClick}>
            <span className="text-xl">&#128269;</span> {/* Tamaño del icono de lupa */}
          </button>
        </div>
</div>


    </div>

    

  </div>
  <div className="ml-5 mr-5 mt-5 flex justify-between">
      <button
          className="py-2 px-4 text-sm bg-blue-900 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent"
          onClick={handleGenerateRoute}>
          Encontrar ruta
      </button>

      <button
          className={`ml-5 py-2 px-4 text-sm bg-green-700 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent
                      ${showButtonState ? 'block' : 'hidden'}`}
          onClick={routeState}>
          Estado de Ruta
      </button>
      <button
        className={`py-2 px-4 text-sm bg-pink-700 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent ${showButtons? 'block': 'hidden'}`}
        onClick={finalizarViaje}>
        Finalizar viaje
      </button>
      <button
          className="ml-5 py-2 px-4 text-sm bg-red-700 text-white rounded hover:bg-white hover:text-teal-500 border border-white hover:border-transparent"
          onClick={handleCancelRoute}>
          Cancelar Ruta
      </button>
      
        {isPopupOpen && <PopupForm onClose={handlePopupSubmit} />}
        {isPopupRouteStateOpen && <PopupRouteState onClose={handlePopupRouteStateSubmit} isOpen={true} travelId={travelId} />}
        {isPopupScoreDriverOpen && <PopupScoreDrivers onClose={handlePopupScoreDriverSubmit} isOpen={true} driverId={driverId} driverName={driverName}/>}
    </div>
    
</div>
        
  </LoadScript>

  );
};

export default MapPassenger;

