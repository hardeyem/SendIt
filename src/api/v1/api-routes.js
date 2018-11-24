/**
 * Created by Adeyemi on 11/14/2018
 */
const jwt  = require('express-jwt');
import {testRouter} from './test/index';
import {authRouter} from './authentication/index';
import {parcelRouter} from './parcel/index';
import {userRouter} from './parcel/user';

const apiRoot = '/api/v1';

const apiRoutes = (app) => {

  const userAuth = jwt({
    secret: process.env.AUTH_SECRET,
    userProperty: 'payload'
  });

  // API routes with authentication validation
  app.use(`${apiRoot}/parcels`, userAuth, parcelRouter);
  app.use(`${apiRoot}/users`, userAuth, userRouter);

  // API routes no authentication
  app.use(`${apiRoot}/test`, testRouter);
  app.use(`${apiRoot}/auth`, authRouter);
};

export {apiRoutes};