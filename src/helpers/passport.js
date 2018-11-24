/**
 * Created by Adeyemi on 11/20/2018
 */

import passport from 'passport';
import * as local from 'passport-local';
import {connect} from '../models/db';
import {User} from '../models/user';

let LocalStrategy = local.Strategy;

export let userPassport = () => {
  return passport.use('user',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, function(username, password, done) {
    console.log(username);
    connect((err, client, close) => {
      if(err){ return done(err); }
      client.query('SELECT * from users where username = $1', [username], (err, result) => {
        if(err) return done(err);
        if(!result || result.length < 1){
          return done(null, false, {
            message: 'Incorrect username.'
          });
        }
        console.log(result.rows);
        let user = new User(result.rows[0]);

        if(!user.validPassword(password)){
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }
        close();
        //remove hash before passing it
        delete user.hash;
        delete user.salt;

        return done(null, user);
      });
    });
  }
  ));
};