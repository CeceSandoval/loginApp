import { useContext } from 'react';
import Login from '../Components/Login';
import { userContext } from '../context/StateProvider';
import AdminLogin from '../Components/AdminLogin';
import Passengers from '../Components/Passengers';
import Drivers from '../Components/Drivers';

const Admin = () => {
  const { state } = useContext(userContext);
  return (
    <div className="flex flex-col  h-screen w-screen bg-gradient-to-br from-teal-500 to-blue-900">
      {!state?.session  ? (
        <AdminLogin />
      ) : ((state.session.userType == "admin" )? (
        <div>
          <h1 className='text-3xl font-bold text-yellow-600 flex justify-center items-center'>
            GoTogether
          </h1>

          <h2 className='text-blue-900 pt-28 font-bold'>
            Welcome Admin
          </h2>
          <div>
            <Passengers />
          </div>
          <div>
            <Drivers />
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
