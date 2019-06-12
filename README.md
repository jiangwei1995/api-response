# express-api-res

Node.js api response uniform format returns middleware.

```js
var express = require('express')
var apiResponse = require('express-api-res')

const app = express();
app.get("/success_text", function(req, res, next) {
   next(new apiResponse.SuccessResponse("OK"))
});

app.use(apiResponse.ResponseJson())
```
## License

[MIT](LICENSE)