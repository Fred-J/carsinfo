module.exports = {
  servers: {
    one: {
      host: '13.54.139.238',
      username: 'ubuntu',
      pem: '../../key.pem',
      // password:
      // or leave blank for authenticate from ssh-agent
      opts: {
        port: 22
      },
      env: {
        CLUSTER_BALANCER_URL: 'https://one.carsinfo.com.au'
      }
    },
    two: {
      host: '13.54.71.149',
      username: 'ubuntu',
      pem: '../../key.pem',
      // password:
      // or leave blank for authenticate from ssh-agent
      opts: {
        port: 22
      },
      env: {
        CLUSTER_BALANCER_URL: 'https://two.carsinfo.com.au'
      }
    }
  },

  // Install MongoDB in the server, does not destroy local MongoDB on future setup
  setupMongo: false,

  // WARNING: Node.js is required! Only skip if you already have Node.js installed on server.
  setupNode: 1,

  meteor: {
    name: 'carsinfo',
    //relative path to the root directory
    path: '..',
    //port: 3000,
    servers: {
      one: {},
      two: {}
    },
    buildOptions: {
      debug: true,
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://carsinfo.com.au',
      MONGO_URL: 'mongodb url',
      //MONGO_URL: 'mongodb://localhost/meteor',
      CLUSTER_DISCOVERY_URL: 'mongodb url',
      CLUSTER_SERVICE: 'carsinfo'
      //CLUSTER_ENDPOINT_URL:'http://samjesse.com'
    },
    ssl: {
      port: 443
    },

    dockerImage: 'kadirahq/meteord:base',
    deployCheckWaitTime: 60
  }

  //mongo: {
  //oplog: true,
  //port: 27017,
  //servers: {
  //one: {},
  //},
  //},
};
