const mongooseClient = require("mongoose")

const connectDatabse = async () => {
    const MONGODB_URI =process.env.DB_CONNECTION_SECRET
    await mongooseClient.connect(MONGODB_URI)
}

module.exports={
connectDatabse
}
