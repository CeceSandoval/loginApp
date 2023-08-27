import { useContext, useState } from 'react';
import Login from '../Components/Login';
import { userContext } from '../context/StateProvider';
import AdminLogin from '../Components/AdminLogin';
import Passengers from '../Components/Passengers';
import Drivers from '../Components/Drivers';
import NavbarAdmin from '../Components/NavbarAdmin';

const Admin = () => {

  const { state } = useContext(userContext);
  const [showPassengers, setShowPassengers] = useState(false); 
  const [showDrivers, setShowDrivers] = useState(true);

  return (
    <div className="flex flex-col  h-screen w-screen bg-gradient-to-br from-teal-500 to-blue-900">
      {!state?.session  ? (
        <AdminLogin />
      ) : ((state.session.userType == "admin" )? (
        <div>
          <NavbarAdmin
            setShowPassengers={setShowPassengers}
            setShowDrivers={setShowDrivers}
          />
          <div>
            {showPassengers && <Passengers />}
          </div>
          <div>
            {showDrivers && <Drivers />}
          </div>
        </div>
      ):(
        <div>
          <AdminLogin />
        </div>
      )
      )}
    </div>
  );
}; 

export default Admin;
