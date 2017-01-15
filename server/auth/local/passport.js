import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import {Client as vSphereClient} from 'vsphere-controller';

import util from 'util';
import _ from 'lodash';

function localAuthenticate(req, username, password, done) {
  var server = req.body.server;

  // Catch all exceptions so invalid usernames/passwords, and host unreachable errors
  //   don't crash the app.
  // TODO: Find a better way to do this instead of blocking all exceptions.
  process.on('uncaughtException', (err) => {
    console.log('Error caught!');
  });

  var vc = new vSphereClient(server, username, password, false);

  vc.once('ready', function() {
    var role = 'user';
    vc.getUserRoles()
      .once('result', function(roles) {
        if(_.find(roles, {user: 'Administrators'})) {
          role = 'admin';
        }
        return done(null, {username: username, vc: vc, role: role});
      })
      .once('error', function(err) {
        return done(null, false, { message: err });
      });
  })
  .once('error', function(err) {
    // Bad password
    if( typeof err === 'string' && err.includes('Cannot complete login due to an incorrect user name or password')) {
      return done(null, false, { message: 'Invalid Username or Password' });
    // Host unreachable
    } else if(typeof err === 'object' && err.code === 'EHOSTUNREACH') {
      return done(null, false, { message: 'vCenter Server unreachable' });
    }
    // Other Error
    return done(null, false, { message: err });
  });

}

export function setup() {
  passport.use(new LocalStrategy({
    passReqToCallback: true
  }, function(req, username, password, done) {
    return localAuthenticate(req, username, password, done);
  }));
}
