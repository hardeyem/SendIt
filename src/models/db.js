/**
 * Created by Adeyemi on 11/23/2018
 */
import {Pool} from 'pg';

export const connect = (callback) => {

  const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    max: 10, // max number of connection
    idleTimeoutMillis: 30000
  };

  const pool = new Pool(config);
  pool.connect((err, client, done) => {
    if(err){
      console.log('DB connection error', err);
      return callback(err, null, null);
    }
    return callback(null, client, done);
  });
};