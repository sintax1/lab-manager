import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import {Client as vSphereClient} from 'vsphere-controller';

import util from 'util';

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
    return done(null, {username: username});
  })
  .once('error', function(err) {
    if( typeof err === 'string' && err.includes('Cannot complete login due to an incorrect user name or password')) {
      return done(null, false, { message: 'Invalid Username or Password' });
    } else if(typeof err === 'object' && err.code === 'EHOSTUNREACH') {
      return done(null, false, { message: 'vCenter Server unreachable' });
    }
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
