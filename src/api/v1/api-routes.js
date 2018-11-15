/**
 * Created by Adeyemi on 11/14/2018
 */

import {testRouter} from './test/index';

const apiRoot = '/api/v1';

const apiRoutes = (app) => {
  // API routes with authentication validation

  // API routes no authentication
  app.use(`${apiRoot}/test`, testRouter);
};

export {apiRoutes};