import React, { useState, useContext } from 'react';
import Navbar from '../Components/Navbar';
import PopupDriver from '../Components/PopupDriver';
import { userContext } from '../context/StateProvider';
import NavbarPassenger from '../Components/NavbarPassenger';
import PopupPassenger from '../Components/PopupPassenger';
import MapPassenger from '../Components/MapPassenger';

import PopupRoute from '../Components/PopupRoute';


// En Passenger
const Passenger = () => {
  const { state } = useContext(userContext);
  const [isPopupUserOpen, setIsPopupUserOpen] = useState(false);
  const [isPopupRouteOpen, setIsPopupRouteOpen] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]); // Definir el estado para drivers

  const loadProfile = () => {
    setIsPopupUserOpen(true);
  };

  const loadRoute = () => {
    setIsPopupRouteOpen(true);
  };

  return (
    <div>

      {isPopupUserOpen && <PopupPassenger onClose={() => setIsPopupUserOpen(false)} />}
      <NavbarPassenger onProfileClick={loadProfile} />
      {isPopupRouteOpen && (
        <PopupRoute
          onClose={() => setIsPopupRouteOpen(false)}
          drivers={drivers} // Pasar drivers como prop
        />
      )}
      <MapPassenger
        onRouteClick={loadRoute}
        setDrivers={setDrivers} // Pasar la función para actualizar drivers
      />

    </div>
  );
};

export default Passenger;
