const apiResponse = require("..");
const http = require("http")
const request = require("supertest")
const express = require("express");
const chai = require("chai");
const app = express();

app.get("/success_text", function(req, res,next) {
    if(req.query["custom"]){
        next(new apiResponse.SuccessResponse("OK"))
    }else{
        next(new apiResponse.SuccessResponse())
    }
    
});
app.get("/success_json", function(req, res,next) {
    next(new apiResponse.SuccessResponse({name:"jack"}))
});
app.get("/error", function(req, res,next) {
    if(req.query["custom"]){
        next(new apiResponse.ErrorResponse("服务器错误"))
    }else{
        next(new apiResponse.ErrorResponse())
    }
});

app.get("/bad_request", function(req, res,next) {
    if(req.query["custom"]){
        next(new apiResponse.BadRequestResponse(["invalid name","invalid password"]))
    }else{
        next(new apiResponse.BadRequestResponse())
    }
});
app.get("/auth_error", function(req, res,next) {
    if(req.query["custom"]){
    next(new apiResponse.AuthErrorResponse("custom message"))
    }else{
        next(new apiResponse.AuthErrorResponse())
    }
});
app.get("/not_found", function(req, res,next) {
    if(req.query["custom"]){
        next(new apiResponse.NotFoundResponse("custom message"))
    }else{
        next(new apiResponse.NotFoundResponse())
    }
});

app.get("/custom_response", function(req, res,next) {
    next({code:201,message:"新建成功"})
});
app.get("/custom_response_error", function(req, res,next) {
    
    next(new Error("没有catch到的错误"))
});

app.use(apiResponse.ResponseJson())

describe("apiResponse.SuccessResponse()",  () => {
    it("should successResponse data type is string ", async () => {
        const res = await request(app).get("/success_text");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body["code"]).eq(200);
    })

    it("should successResponse data type is string custom=true", async () => {
        const res = await request(app).get("/success_text?custom=true");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("data");
        chai.expect(res.body["code"]).eq(200);
        chai.expect(res.body["data"]).eq("OK");
    })

    it("should successResponse data type is json ", async () => {
        const res = await request(app).get("/success_json");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("data");
        chai.expect(res.body["data"]).to.have.property("name");
        chai.expect(res.body["code"]).eq(200);
        chai.expect(res.body["data"]["name"]).eq("jack");
    })
})


describe("apiResponse.ErrorResponse()",  () => {
    it("ErrorResponse()", async () => {
        const res = await request(app).get("/error");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body["code"]).eq(500);
    })
    it("ErrorResponse(\"服务器错误\")", async () => {
        const res = await request(app).get("/error?custom=true");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("message");
        chai.expect(res.body["code"]).eq(500);
        chai.expect(res.body["message"]).eq("服务器错误");
    })
})

describe("apiResponse.BadRequestResponse",  () => {
    it("BadRequestResponse() custom=true", async () => {
        const res = await request(app).get("/bad_request?custom=true");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("message");
        chai.expect(res.body).to.have.property("errors");
        chai.expect(res.body["code"]).eq(400);
        chai.expect(res.body["message"]).eq("Bad Request");
        chai.expect(res.body["errors"].length).eq(2);
        chai.expect(res.body["errors"][0]).eq("invalid name");
        chai.expect(res.body["errors"][1]).eq("invalid password");
    })

    it("BadRequestResponse()", async () => {
        const res = await request(app).get("/bad_request?custom=true");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("message");
        chai.expect(res.body["code"]).eq(400);
        chai.expect(res.body["message"]).eq("Bad Request");
    })
})

describe("apiResponse.AuthErrorResponse()",  () => {
    it("AuthErrorResponse()", async () => {
        const res = await request(app).get("/auth_error");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("message");
        chai.expect(res.body["code"]).eq(401);
        chai.expect(res.body["message"]).eq("Authorization required");
    })
    it("AuthErrorResponse(\"custom message\")", async () => {
        const res = await request(app).get("/auth_error?custom=true");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("message");
        chai.expect(res.body["code"]).eq(401);
        chai.expect(res.body["message"]).eq("custom message");
    })
})

describe("apiResponse.NotFoundResponse()",  () => {
    it("NotFoundResponse()", async () => {
        const res = await request(app).get("/not_found");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("message");
        chai.expect(res.body["code"]).eq(404);
        chai.expect(res.body["message"]).eq("Not Found");
    })
    it("NotFoundResponse(\"custom message\")", async () => {
        const res = await request(app).get("/not_found?custom=true");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("message");
        chai.expect(res.body["code"]).eq(404);
        chai.expect(res.body["message"]).eq("custom message");
    })
})

describe("custom response",  () => {
    it("custom response", async () => {
        const res = await request(app).get("/custom_response");
        chai.expect(res.body).to.have.property("code");
        chai.expect(res.body).to.have.property("message");
        chai.expect(res.body["code"]).eq(201);
        chai.expect(res.body["message"]).eq("新建成功");
    })

    it("custom error response", async () => {
        const res = await request(app).get("/custom_response_error");
        chai.expect(res.text).eq(`Internal Server Error:没有catch到的错误`);
    })
})