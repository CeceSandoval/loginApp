import React, { useState, useContext } from 'react';
import Navbar from '../Components/Navbar';
import Map from '../Components/Map';
import PopupDriver from '../Components/PopupDriver';
import { userContext } from '../context/StateProvider';

const Driver = () => {
  const { state } = useContext(userContext);
  const [isPopupUserOpen, setIsPopupUserOpen] = useState(false);

  const loadProfile = () => {
    setIsPopupUserOpen(true);
  };

  return (
    <div>
        {isPopupUserOpen && <PopupDriver onClose={() => setIsPopupUserOpen(false)}  />}
        <Navbar onProfileClick={loadProfile} />
        <Map />
    </div>
  );
};

export default Driver;
