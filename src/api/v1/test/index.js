/**
 * Created by Adeyemi on 11/14/2018
 */

import { Router } from 'express';
import * as log from 'fancy-log';

const testRouter = Router();

testRouter.get('/', (req, res) => {
  log.info('request made');
  res.status(200).json({message: 'Server is working'});
});

export { testRouter };