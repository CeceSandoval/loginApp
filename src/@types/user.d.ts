/** src/@types/user.d.ts */
import uuid from 'uuid';

interface Iuser {
  type: IuserType;
  facialId: string;
  name: string;
  email: string;
  identificationNumber: string;
  licensePlate: string;
  carModel: string;
  qualifying: number;
}

