import uuid from 'uuid';
import { Iuser } from './user';

interface IRoute {
    id : uuid;
    startTime : number;
    enabled : boolean;
    driver : Iuser,
    passengers : Iuser[]
}