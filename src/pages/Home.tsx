import { useContext } from 'react';
import Login from '../Components/Login';
import Map from '../Components//Map';
import { userContext } from '../context/StateProvider';
import Navbar from '../Components/Navbar';
import Passenger from './Passenger';
import Driver from './Driver';

const Home = () => {
  const { state } = useContext(userContext);
  console.log(state)
  return (
    <div className='min-h-screen flex flex-col '>
      {!state?.session  ? (
        
            <Login />
            
      ) : ((state.session.userType === "driver" )? (
        <div className="flex flex-col  h-screen w-screen bg-gradient-to-br from-teal-500 to-blue-900">
            <Driver/>
        </div>

      ):( (state.session.userType === "passenger" )? (
        <div className="flex flex-col  h-screen w-screen bg-gradient-to-br from-teal-500 to-blue-900">
            <Passenger/>
        </div> 
        ):(<div></div>)
      )
      )}
    </div>

  );
};

export default Home;
