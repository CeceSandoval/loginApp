/** src/@types/user.d.ts */

interface Iuser {
  typeId: int;
  facialId: string;
  name: string;
  email: string;
  identificationNumber: string;
  licensePlate: string;
  carModel: string;
}

export type userContextType = {
  user: Iuser | null;
};

type Action = {
  type: 'SET_USER';
  user: Iuser;
};
