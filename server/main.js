import { Meteor } from 'meteor/meteor';


Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false});


Meteor.startup(() => {

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.outgoingServer) + ':' + smtp.outgoingPort;
});

Meteor.methods({
  'rmsFreeInfo': () => {

  },
  'sendEmail': (msg) => {

  },
  'ddpOut': (arg) => {
  },
  'engineUpdate': (param) => {
    console.log('engneUpdate called');
  },
  'vinUpdate': (param) => {
  }
});
