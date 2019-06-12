const app = express();
const apiResponse = require("express-api-res");
app.get("/success_text", function(req, res, next) {
   next(new apiResponse.SuccessResponse("OK"))
});
app.use(apiResponse.ResponseJson())