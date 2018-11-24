/**
 * Created by Adeyemi on 11/24/2018
 */
import {connect} from '../models/db';

export class ParcelProvider {

  static getAllParcel(callback){
    const sql = 'SELECT * FROM parcels';

    connect((err, client, close) => {
      if(err) return callback(err, null);

      client.query(sql, []).then(result => {
        close();
        callback(null, result.rows);
      }).catch(e => {
        close();
        callback(e, null);
      });
    });
  }

  static getUserParcels(userId, callback) {
		const sql = 'SELECT * FROM parcels where placedby = $1';
		const value = [userId];

		connect((err, client, close) => {
			if(err) return callback(err, null);

			client.query(sql, value).then(result => {
				close();
				callback(null, result.rows);
			}).catch(e => {
				close();
				callback(e, null);
			});
		});
	}

	static getParcelById(id, callback) {
		const sql = 'SELECT * FROM parcels where id = $1';
		const value = [id];

		connect((err, client, close) => {
			if(err) return callback(err, null);

			client.query(sql, value).then(result => {
				close();
				callback(null, result.rows);
			}).catch(e => {
				close();
				callback(e, null);
			});
		});
	}

	static changeParcelStatus(parcelId, status, callback ){
		const sql = 'UPDATE parcels SET status = $1 where id = $2';
		const value = [status, parcelId];

		connect((err, client, close) => {
			if(err) return callback(err, null);

			client.query(sql, value).then(result => {
				close();
				console.log(result);
				callback(null, true);
			}).catch(e => {
				close();
				callback(e, null);
			});
		});
	}

	static changeParcelLocation(parcelId, location, callback ){
		const sql = 'UPDATE parcels SET currentlocation = $1 where id = $2';
		const value = [location, parcelId];

		connect((err, client, close) => {
			if(err) return callback(err, null);

			client.query(sql, value).then(result => {
				close();
				console.log(result);
				callback(null, true);
			}).catch(e => {
				close();
				callback(e, null);
			});
		});
	}

	static changeParcelDestination(parcelId, destination, callback ){
		const sql = 'UPDATE parcels SET tolocation = $1 where id = $2';
		const value = [destination, parcelId];

		connect((err, client, close) => {
			if(err) return callback(err, null);

			client.query(sql, value).then(result => {
				close();
				console.log(result);
				callback(null, true);
			}).catch(e => {
				close();
				callback(e, null);
			});
		});
	}

}