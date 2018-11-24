/**
 * Created by Adeyemi on 11/24/2018
 */
import { Router } from 'express';
import * as log from 'fancy-log';
import {
  getUserParcels
} from './controller';

const userRouter = Router();

userRouter.get('/:id/parcels', getUserParcels);

export { userRouter };