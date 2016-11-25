import { Meteor } from 'meteor/meteor';

//Cluster.connect('mongodb://samjesse:Ed66_gSep04@cluster0-shard-00-00-oko1k.mongodb.net:27017,cluster0-shard-00-01-oko1k.mongodb.net:27017,cluster0-shard-00-02-oko1k.mongodb.net:27017/dbais2?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
//Cluster.register('carsinfo');
//let ais2Conn = Cluster.discoverConnection('ais2');

Meteor.startup(() => {

  smtp = {
    username: 'sam@totalcareauto.com.au',
    password: 'sam19351',
    incomingServer: 'pop.ipage.com',
    incomingPort: '110',
    outgoingServer: 'smtp.ipage.com',
    outgoingPort: '587'
  };

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.outgoingServer) + ':' + smtp.outgoingPort;
  Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false});
});
const makes = {
  "FOR": "FORD",
  "HON": "HONDA",
  "TOY": "TOYOTA",
  "NIS": "NISSAN",
  "MAZ": "MAZDA",
  "LEX": "LEXUS",
  "HOL": "HOLDEN",
  "MER": "MERCEDES-BENZ",
  "HYU": "HYUNDAI",
  "SMT": "SMART",
  "DAI": "DAIHATSU",
  "DGE": "DODGE",
  "LAN": "LAND ROVER",
  "JEP": "JEEP",
  "MIT": "MITSUBISHI",
  "AUD": "AUDI",
  "PRO": "PROTON",
  "REN": "RENAULT",
  "PEU": "PEUGEOT",
  "VLK": "VOLKSWAGEN",
  "CHR": "CHRYSLER",
  "SUB": "SUBARU"
};

Meteor.methods({
  'rmsFreeInfo': (plate) => {
    const response = HTTP.get("https://myrta.com/regoapi/vehicle/free/" + plate.toLowerCase());
    if (response.content.indexOf('temporarily unavailable') >= 0) {
      VehiclesDetailsCol.upsert({plateNum: plate}, {msg: 'Error: RMS Unavailable now'});
    }
    else if (response.data.status.errorMessages.length > 0) {
      VehiclesDetailsCol.upsert({plateNum: plate}, {msg: 'Error: No information'});
    }
    else {
      const vehicles = response.data.vehicles;
      for (let i = 0; i < vehicles.length; i++) {
        const vinDummy = response.data.vehicles[i].vin;
        const vin4 = vinDummy.substr(vinDummy.length - 4);
        const tare = response.data.vehicles[i].tareWeight;
        const expiry = response.data.vehicles[i].expiryDate; // dd/mm/yyyy
        let rmsDescription = rmsCleanDescription(response.data.vehicles[i].vehicleDescription);
        const selector = {plateNum: plate, vin4: vin4};
        VehiclesDetailsCol.upsert(selector,
          {$set: {createdAt: Date.now(), plateNum: plate, vin4: vin4, expiry: expiry, tare: tare, rmsDescription: rmsDescription}});
      }
    }
  },
  'sendEmail': (msg) => {
    Email.send({
      to: 'revrvr@gmail.com',
      from: 'revrvr@gmail.com',
      subject: 'Car Info',
      text: msg
    });
  },
  'ddpOut': (arg) => {
    //ais2Conn.call('ddpIn', 'this is carsInfo', (err, res) => {
    //  if (!err) {
    //    console.log('got back from ais2 ' + res);
    //  }
    //})
  },
  'engineUpdate': (param) => {
    console.log('engneUpdate called');
    //ais2Conn.call('engineUpdate', param, () => {})
  },
  'vinUpdate': (param) => {
    console.log('calling vinUpdate in carsInfo');
    //ais2Conn.call('vinUpdate', param, () => {});
  }
});

const rmsCleanDescription = (raw) => {
  let unwanted = /MOTOR CORPORATION|STATION|FORWARD|CONTROL|PASSENGER|VEHICLE|PANEL|VAN|with.*-/ig;
  let spaces = /(\s+)/g;
  let doubles = /\b(\w+)\b\s+\1/g;
  let description = raw.replace(unwanted, '').replace(spaces, ' ').replace(doubles, '$1').trim();
  let makeAbbreviation = description.split(' ')[2];
  if (makeAbbreviation.length === 3) {
    description = description.replace(makeAbbreviation, makes[makeAbbreviation]);
  }
  return description;
};