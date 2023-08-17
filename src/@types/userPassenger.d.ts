/** src/@types/user.d.ts */

interface IuserPassenger {
    facialId: string;
    name: string;
    email: string;
    identificationNumber: string;

  }
  
  export type userContextType = {
    user: IuserPassenger | null;
  };
  
  type Action = {
    type: 'SET_USER';
    user: IuserPassenger;
  };