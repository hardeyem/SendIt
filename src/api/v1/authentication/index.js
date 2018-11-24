/**
 * Created by Adeyemi on 11/20/2018
 */

import { Router } from 'express';
import * as log from 'fancy-log';
import {
  registerUser,
  login
} from './controller';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/signup', registerUser);

export { authRouter };