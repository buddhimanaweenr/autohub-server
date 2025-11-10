import mongodb from "mongodb"
const getDb = require('../util/database').getDb;
import isEmpty from '../util/common/isEmpty';
const modelElement = 'user'

class User {
    constructor(data) {
        this._id = !isEmpty(data._id) ? new mongodb.ObjectId(data._id) : '';
        this.fullName = !isEmpty(data.fullName) ? data.fullName : '';
        this.userName = !isEmpty(data.userName) ? data.userName : '';
        this.userEmail = !isEmpty(data.userEmail) ? data.userEmail : '';
        this.password = !isEmpty(data.password) ? data.password : '';
    }

    static fetchAll(filter) { // Get all Records
        const db = getDb();
        return db
          .collection(modelElement)
          .aggregate(filter)
          .toArray()
          .then(result => {
            return result;
          })
          .catch(err => {
            console.log(err);
          });
      }

    static findById(id) { // Find Record by ID
        const db = getDb();
        return db
          .collection(modelElement)
          .find({ _id: new mongodb.ObjectId(id) })
          .next()
          .then(result => {
            return result;
          })
          .catch(err => {
            console.log(err);
          });
    }

    static findByUserName(userName) { 
      const db = getDb();
      return db
        .collection(modelElement)
        .find({ userName: userName })
        .next()
        .then(result => {
          return result;
        })
        .catch(err => {
          console.log(err);
        });
  }

    static findByCustomAggregateFiltering(filter) {
        const db = getDb();
        
        return db
          .collection(modelElement)
          .aggregate(filter)
          .toArray()
          .then(result => {
            return result;
          })
          .catch(err => {
            console.log(err);
          });
      }

    static save(data) {
        const db = getDb();
        let dbOp;
        if (!isEmpty(data._id)) {
            var id  = mongodb.ObjectId(data._id);
            delete data._id;
  
            data.updatedDateTime = new Date();
    
            dbOp = db
            .collection(modelElement)
            .updateOne({ _id: id }, { $set: data });
          } else {
            data.isActive = true;
            data.createdDateTime = new Date();
            data.updatedDateTime = new Date();
            
            dbOp = db.collection(modelElement).insertOne(data);
          }
        
        return dbOp
          .then(result => {
            return result;
          })
          .catch(err => {
            console.log(err);
          });
    }

    static deleteById(id) { // Delete by ID
        const db = getDb();
        return db
          .collection(modelElement)
          .deleteOne({ _id: new mongodb.ObjectId(id) })
          .then(result => {
            return result;
          })
          .catch(err => {
            console.log(err);
          });
    }

}

module.exports = User;