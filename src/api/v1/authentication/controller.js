/**
 * Created by Adeyemi on 11/20/2018
 */
import passport from 'passport';
import validator from 'validator';
import {Utility} from '../../../helpers/util';
import {statusCode} from '../../../constants';
import {User} from '../../../models/user';
import {connect} from '../../../models/db';

export let registerUser = (req, res, next) => {
  console.log('registering user');
  const body = req.body;
  const required = [
    {name : 'firstname', type: 'string'},
    {name : 'lastname', type: 'string'},
    {name : 'othernames', type: 'string'},
    {name : 'email', type: 'string'},
    {name : 'username', type: 'string'},
    {name : 'isadmin', type: 'boolean'},
    {name : 'password', type: 'string'},
  ];

  const verify = Utility.validParam(body, required);
  if(verify.success){
    if(!validator.isEmail(body.email)){
      return Utility.sendErrorResponse(res, body, 'Valid email format is required', statusCode.ERROR);
    }
    let newUser = new User(body);
    newUser.setPassword(body.password);
    const sql = `INSERT INTO users(firstname, lastname, othernames, email, username, isadmin, salt, hash) 
								VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;
    const values = newUser.toArrayValue();
    console.log(values);

    connect((err, client, done) => {
      if(err) return Utility.sendErrorResponse(res, body, 'Oops! Something went wrong.', statusCode.ERROR);
      console.log(sql);
      client.query(sql, values).then(result => {
        done();
        console.log(result);
        authenticate(req, res);

        // return Utility.sendSuccessResponse(res, {user: body, token}, statusCode.SUCCESS);
      }).catch(e => {
        done();
        console.log(e.stack);
        return Utility.sendErrorResponse(res, body, 'Oops! username or email is taken', statusCode.ERROR);
      });
    });
  }else{
    return Utility.sendErrorResponse(res, body, verify.message, statusCode.ERROR);
  }
};

export let login = (req, res, next) => {
  console.log('auth user');
  const body = req.body;
  const required = [
    {name : 'username', type: 'string'},
    {name : 'password', type: 'string'},
  ];

  const verify = Utility.validParam(body, required);
  if(verify.success){
    authenticate(req, res);
  } else{
    return Utility.sendErrorResponse(res, body, verify.message, statusCode.ERROR);
  }
};

function authenticate(req, res) {
  return passport.authenticate('user', function (err, user, info) {
    let token;
    if (err) {
      Utility.sendErrorResponse(res, err, 'Authentication Error', statusCode.UNAUTHORIZED);
      return;
    }
    if (user) {
      token = user.generateJWT();
      Utility.sendSuccessResponse(res, [{
        'token': token,
        user: user
      }], statusCode.AUTHENTICATED);
    } else {
      Utility.sendErrorResponse(res, [], info.message, statusCode.UNAUTHORIZED);
    }
  })(req, res);
}
