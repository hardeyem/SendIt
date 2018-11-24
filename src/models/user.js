/**
 * Created by Adeyemi on 11/15/2018
 */
import {sign, verify} from 'jsonwebtoken';
import {pbkdf2Sync, randomBytes} from 'crypto';
import {connect} from './db';

export class User {

  constructor(user = {}) {
    this.id = user.id || null;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.othernames = user.othernames;
    this.email = user.email;
    this.username = user.username;
    this.isadmin = user.isadmin;
    this.hash = user.hash || '';
    this.salt = user.salt || '';
    this.registered = user.registered || '';
  }

  toArrayValue() {
    return [this.firstname, this.lastname, this.othernames, this.email, this.username, this.isadmin, this.salt, this.hash];
  }

  setPassword(password) {
    this.salt = randomBytes(16).toString('hex');
    this.hash = pbkdf2Sync(password, this.salt, 1000, 64, 'SHA1').toString('hex');
  }

  validPassword(password) {
    const hash = pbkdf2Sync(password, this.salt, 1000, 64, 'SHA1').toString('hex');
    return this.hash === hash;
  }

  generateJWT() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);//expire in seven days
    return sign({
      username: this.username,
      isAdmin: this.isadmin,
      id: this.id,
      exp: expiry.getTime()
    }, process.env.AUTH_SECRET);
  }

  static getUserByUsername(username, callback) {
    connect((err, client, close) => {
      if (err) {
        return callback(err);
      }
      client.query('SELECT * from users where username = $1', [username], (err, result) => {
        if (err) return done(err);
        if (!result || result.length < 1) {
          callback(null, null);
        }
        console.log(result.rows);
        let user = new User(result.rows[0]);

        close();
        //remove hash before passing it
        delete user.hash;
        delete user.salt;

        return callback(null, user);
      });
    });
  }
}