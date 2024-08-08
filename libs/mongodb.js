import mongoose from "mongoose";

const connectMongoDb = async () => {
    try{
        await mongoose.connect( "mongodb+srv://awaiskhaliq77in:osFpfTS8j25i3RIV@cluster0.2bhqa.mongodb.net/" );
        console.log( 'Connected' );
    } catch ( error ) {
        console.log( error );
    }
}

export default connectMongoDb;