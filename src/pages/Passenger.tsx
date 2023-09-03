import React, { useState, useContext } from 'react';
import Navbar from '../Components/Navbar';
import Map from '../Components/Map';
import PopupDriver from '../Components/PopupDriver';
import { userContext } from '../context/StateProvider';
import NavbarPassenger from '../Components/NavbarPassenger';
import PopupPassenger from '../Components/PopupPassenger';
import MapPassenger from '../Components/MapPassenger';

const Passenger = () => {
  const { state } = useContext(userContext);
  const [isPopupUserOpen, setIsPopupUserOpen] = useState(false);

  const loadProfile = () => {
    setIsPopupUserOpen(true);
  };

  return (
    <div>
        {isPopupUserOpen && <PopupPassenger onClose={() => setIsPopupUserOpen(false)}  />}
        <NavbarPassenger onProfileClick={loadProfile} />
        <MapPassenger />
    </div>
  );
};

export default Passenger;
