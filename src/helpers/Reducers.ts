import { userContextType, Action } from '../@types/session';


//the initial state of the user
export const initialState = {
  session: null
};


//the action we are going to take when we login that is set the user
export const actionTypes = {
  SET_SESSION: 'SET_SESSION',
};


//the reducer function note the parameter type annotations
export const reducer = (state: userContextType, action: Action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_SESSION:
      return {
        ...state,
          session: action.session,
      };
    default:
      return state;
  }
};



