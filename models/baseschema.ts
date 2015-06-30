import mongoose = require('mongoose');

export interface IBaseSchema extends mongoose.Document {
    created: Date,
    modified: Date;
}

/**
 * Used as interface ("implements"). Defines static members for Schema/Model interaction with mongoose
 */
export class MongooseSchemaBuilder<TSchema extends IBaseSchema> {
    static schema: mongoose.Schema;
    static model: mongoose.Model<IBaseSchema>;
    //createModelInstance(schemaInst: TSchema): mongoose.Promise<TSchema>;
}