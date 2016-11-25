module.exports = {
  servers: {
    one: {
      host: '13.54.139.238',
      username: 'ubuntu',
      pem: "../../aws/ais2.pem"
    }
  },

  meteor: {
    name: 'carsinfo',
    path: '../../carsinfo',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true
    },
    env: {
      ROOT_URL: 'http://carsinfo.com.au',
      MONGO_URL: 'mongodb://samjesse:Ed66_gSep04@cluster0-shard-00-00-oko1k.mongodb.net:27017,cluster0-shard-00-01-oko1k.mongodb.net:27017,cluster0-shard-00-02-oko1k.mongodb.net:27017/dbais2?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
    },
    docker: {
      image: 'abernix/meteord:base'
    },
    deployCheckWaitTime: 60
  }
};