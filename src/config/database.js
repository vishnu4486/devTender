const mongooseClient = require("mongoose")

const connectDatabse = async () => {
    // const MONGODB_URI="mongodb+srv://biradarvishnu89_db_user:792MsZKmkrLcUAnw@namasatenode.ptponof.mongodb.net/devTinder";//old one
    // mongodb+srv://biradarvishnu89_db_user:792MsZKmkrLcUAnw@namasatenode.ptponof.mongodb.net/
    const MONGODB_URI ="mongodb+srv://biradarvishnu89_db_user:YNx7bABmdB4nhP3H@cluster0.aguekau.mongodb.net/devTinder"
    await mongooseClient.connect(MONGODB_URI)
}

module.exports={
connectDatabse
}
