Meteor.publish('vehiclesDetailsCol', function (plate) {
  if (!this.userId) return;
  let matcher = new RegExp('[a-z0-9]{1,7}', "gi");
  if (matcher.test(plate)) {
    return VehiclesDetailsCol.find({plateNum: plate}, {fields: {plateNum: true, rmsDescription: true, vin: true, engineNum: true, engineSize: true}});
  }
});

//3d
VehiclesDetailsCol.after.update(function (userId, doc, fieldNames, modifier, options) {
  // ...
  console.log('updated just');
});