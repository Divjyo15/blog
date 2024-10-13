const mongoose = require("mongoose");
function connectdb(){
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Db Connected"))
    .catch((err) => console.log("Moongo error", err));
}
    module.exports = {connectdb};
