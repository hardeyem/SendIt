/**
 * Created by Adeyemi on 11/24/2018
 */
import { Router } from 'express';
import * as log from 'fancy-log';
import {
  getAllParcels,
  cancelParcel,
  changeParcelDestination,
  changeParcelLocation,
  changeParcelStatus,
  createParcelOrder,
  getParcelById
} from './controller';

const parcelRouter = Router();

parcelRouter.get('/', getAllParcels);
parcelRouter.get('/:id', getParcelById);
parcelRouter.post('/', createParcelOrder);
parcelRouter.patch('/:id/cancel', cancelParcel);
parcelRouter.patch('/:id/destination', changeParcelDestination);
parcelRouter.patch('/:id/status', changeParcelStatus);
parcelRouter.patch('/:id/currentlocation', changeParcelLocation);

export { parcelRouter };