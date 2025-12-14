import mongodb from "mongodb"
const getDb = require('../util/database').getDb;
import isEmpty from '../util/common/isEmpty';
const modelElement = 'vehicle'

class Vehicle {
    constructor(data) {
        this._id = !isEmpty(data._id) ? new mongodb.ObjectId(data._id) : '';
        this.make = !isEmpty(data.make) ? data.make : '';
        this.model = !isEmpty(data.model) ? data.model : '';
        this.year = !isEmpty(data.year) ? data.year : '';
        this.sellingPrice = !isEmpty(data.sellingPrice) ? data.sellingPrice : 0;
        this.mileage = !isEmpty(data.mileage) ? data.mileage : 0;
        this.transmission = !isEmpty(data.transmission) ? data.transmission : '';
        this.fuelType = !isEmpty(data.fuelType) ? data.fuelType : '';
        this.color = !isEmpty(data.color) ? data.color : '';
        this.engine = !isEmpty(data.engine) ? data.engine : '';
        this.drivetrain = !isEmpty(data.drivetrain) ? data.drivetrain : '';
        this.description = !isEmpty(data.description) ? data.description : '';
        this.images = !isEmpty(data.images) ? data.images : [];
        this.isActive = !isEmpty(data.isActive) ? data.isActive : true;
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

      
      // Validate ObjectId before querying
      if (isEmpty(id) || !mongodb.ObjectId.isValid(id)) {
        return Promise.resolve(null);
      }
      
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

    static findByMake(make) { 
      const db = getDb();
      return db
        .collection(modelElement)
        .find({ make: make })
        .toArray()
        .then(result => {
          return result;
        })
        .catch(err => {
          console.log(err);
        });
  }

    static findByModel(model) { 
      const db = getDb();
      return db
        .collection(modelElement)
        .find({ model: model })
        .toArray()
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

module.exports = Vehicle;


