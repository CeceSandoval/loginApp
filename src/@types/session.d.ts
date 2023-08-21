import uuid from 'uuid';

interface Issesion {
    id: uuid;
    userId: uuid;
    userType: string;
  }


  export type userContextType = {
    session: Issesion | null;
  };
  
  type Action = {
    type: 'SET_SESSION';
    session: Issesion;
  };
  