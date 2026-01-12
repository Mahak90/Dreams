import mongoose from 'mongoose'
import env_config from './env.config.js'



async function connectDb() {
  try {
    await mongoose.connect(env_config.MONGO_URI)
    console.log("connect to mongoDb")
  } catch (error) {
    console.log(error)
  }

}

export default connectDb