/**
 * Created by Adeyemi on 11/24/2018
 */
import validator from 'validator';
import {Utility} from '../../../helpers/util';
import {statusCode} from '../../../constants';
import {User} from '../../../models/user';
import {Parcel} from '../../../models/parcel';

export const getAllParcels = (req, res, next) => {
  return Utility.sendSuccessResponse(res, {}, statusCode.SUCCESS);
};

export const getUserParcels = (req, res, next) => {
  return Utility.sendSuccessResponse(res, {}, statusCode.SUCCESS);
};

export const getParcelById = (req, res, next) => {
  return Utility.sendSuccessResponse(res, {}, statusCode.SUCCESS);
};

export const cancelParcel = (req, res, next) => {
  return Utility.sendSuccessResponse(res, {}, statusCode.SUCCESS);
};

export const createParcelOrder = (req, res, next) => {
  if(!isAuthenticated(req.payload)){
    return Utility.sendErrorResponse(res, {}, 'User could not be determined', statusCode.UNAUTHORIZED);
  }

  let body = req.body;
  const required = [
    {name : 'weight', type: 'number'},
    {name : 'weightmetric', type: 'string'},
    {name : 'fromlocation', type: 'string'},
    {name : 'tolocation', type: 'string'},
  ];

  const verify = Utility.validParam(body, required);
  if(verify.success){

    User.getUserByUsername(req.payload.username, (err, user ) => {
      console.log(err);
      if(err) return next();
      if(user){
        body.placedBy = user.id;
        body.currentLocation = body.from;

        let newParcel = new Parcel(body);
        newParcel.createParcel((err, created) => {
          console.log(err);
          if(err)return next();

          if(created){
            return Utility.sendSuccessResponse(res, newParcel, statusCode.SUCCESS);
          } else {
            return Utility.sendErrorResponse(res, {}, 'Oops! Something went wrong when creating parcel', statusCode.ERROR);
          }
        });

      }else {
        return Utility.sendErrorResponse(res, {}, 'User not found', statusCode.ERROR);
      }
    });
  } else{
    return Utility.sendErrorResponse(res, body, verify.message, statusCode.ERROR);
  }
};

export const changeParcelDestination = (req, res, next) => {
  return Utility.sendSuccessResponse(res, {}, statusCode.SUCCESS);
};

export const changeParcelStatus = (req, res, next) => {
  return Utility.sendSuccessResponse(res, {}, statusCode.SUCCESS);
};

export const changeParcelLocation = (req, res, next) => {
  return Utility.sendSuccessResponse(res, {}, statusCode.SUCCESS);
};

function isAuthenticated(payload){
  return !!(payload && payload.username);
}

function isAdmin(payload){
  return !!payload.isAdmin;
}