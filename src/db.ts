import mongoose from 'mongoose'
import config from './config/default'

const connectDB = async () => {
    try {
        await mongoose.connect(config.dbURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            // useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

export default connectDB;