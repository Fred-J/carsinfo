import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

let searching = '';

Template.results.helpers({
  'display': () => {
    let doc = VehiclesDetailsCol.findOne({plateNum: Session.get('plateNum')});
    let res = {};
    res.vin = doc && doc.vin ? doc.vin : searching;
    res.engineNum = doc && doc.engineNum ? doc.engineNum : searching;
    res.engineSize = doc && doc.engineSize ? doc.engineSize : '';
    res.engine = res.engineNum + ' ' + res.engineSize;
    res.rmsDescription = doc && doc.rmsDescription ? doc.rmsDescription : searching;
    return res;
  }
});

Template.header.helpers({
  'header': () => {
    if (Session.get('busy')) {
      return '<p class="busy">Busy! please wait...</p>';
    } else {
      return '<p>Cars Info</p>';
    }
  }
});

Template.footer.events({
  'click #clear': () => {  //2a
    Session.set('busy', false);
    document.getElementById('plateNum').value = '';
    Session.set('plateNum', '');
    searching = '';
    Meteor.call('ddpOut', 'call from carsinfo');
  },
  'click #info': () => {
    searching = '<span class="note">Searching...</span>';
    let plate = document.getElementById('plateNum').value;
    plate = plate.replace(/\W/g, '').toLowerCase().trim();  //3a
    if (!plate) {
      Bert.alert('<p>Check entries</p>', 'danger');
      Session.set('busy', false);
      return;
    }
    //get missing info  //3c
    Session.set('plateNum', plate);//3b
    let doc = VehiclesDetailsCol.findOne({plateNum: Session.get('plateNum')});
    if (!doc || !doc.rmsDescription) Meteor.call('rmsFreeInfo', plate);
    if (doc && !doc.vin) Meteor.call('vinUpdate', {plateNum: plate, vin4: doc.vin4}, () => {});
    if (doc && doc.vin && !doc.engineSize) Meteor.call('EngineUpdate', {plateNum: plate, vin: doc.vin}, () => {});
  }
});

Template.feedback.events({
  'click #email': () => {
    let msg = document.getElementById('feedback').value;
    if (msg.trim() == '') return;
    $('#response').text('Thank you');
    setTimeout(function () {
      $('#response').text('');
      $('#feedback').val('')
    }, 3000);
    Meteor.call('sendEmail', msg);
  }
});

Template.footer.onCreated(function() {
  this.autorun(function() {
    if(Meteor.userId()) {
      Meteor.subscribe('vehiclesDetailsCol', Session.get('plateNum'));
    }
  });
});