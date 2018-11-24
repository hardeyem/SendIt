import {connect} from './db';
import {statusCode} from '../constants';
import {Utility} from '../helpers/util';

/**
 * Created by Adeyemi on 11/24/2018
 */

export class Parcel {
  constructor(parcel = {}) {
    this.id = parcel.id || null;
    this.placedBy = parcel.placedBy;
    this.weight = parcel.weight;
    this.weightmetric = parcel.weightmetric;
    this.sentOn = parcel.sentOn;
    this.deliveredOn = parcel.deliveredOn;
    this.status = parcel.status;
    this.fromlocation = parcel.fromlocation;
    this.tolocation = parcel.tolocation;
    this.currentLocation = parcel.currentLocation;
  }

  toArray(){
    return [
      this.placedBy,
      this.weight,
      this.weightmetric,
      this.fromlocation,
      this.tolocation,
      this.currentLocation
    ];
  }

  createParcel(callback){

    const sql = 'INSERT INTO parcels(placedby, weight, weightmetric, fromlocation, tolocation, currentlocation) VALUES($1, $2, $3, $4, $5, $6) RETURNING id';
    const values = this.toArray();
    console.log(sql);
    console.log(values);

    connect((err, client, close) => {
      if(err) return callback(err, null);

      client.query(sql, values).then(result => {
        close();
        this.id = result.rows[0].id;
        callback(null, true);
        // return Utility.sendSuccessResponse(res, {user: body, token}, statusCode.SUCCESS);
      }).catch(e => {
        close();
        callback(e, null);
      });
    });
  }
}