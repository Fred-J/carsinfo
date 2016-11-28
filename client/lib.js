Template.registerHelper('isVerified', function () { // return a true or false depending on whether the referenced user's email has been verified
  if (Meteor.user() && Meteor.user().emails) return Meteor.user().emails[0].verified; // look at the current user
  else return false;
});