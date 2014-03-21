var express = require('express');
var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());


var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.ObjectId;
var Schema = mongoose.Schema;

var restify = require('express-restify-mongoose')
restify.defaults({
    prefix: "/",
    version: "1"
})
app.use(express.static(__dirname + '/client'));

mongoose.connect("mongodb://localhost/coursebuilder");

//var restful = require('node-restful')
var path = require('path')

var Problem = new Schema({
    title: { type: String},
    body: { type: String },
    type: { type: String},
    correct_answer: { type: String},
    choices: [
        {
            id: { type: String},
            body: { type: String},
            is_correct: { type: Boolean}
        }
    ]
});
var ProblemModel = mongoose.model('Problem', Problem);

var Activity = new Schema({
    title: { type: String, required: true },
    summary: { type: String },
    body: { type: String },
    type: { type: String},
    is_final: { type: Boolean},
    randomize_problems: { type: Boolean},
    randomize_choices: { type: Boolean},
    problems: [
        {type: ObjectId, ref: "Problem"}
    ]
});
var ActivityModel = mongoose.model('Activity', Activity);

var Lesson = new Schema({
    title: { type: String, required: true },
    summary: { type: String },
    activities: [
        {type: ObjectId, ref: "Activity"}
    ]
});
var LessonModel = mongoose.model('Lesson', Lesson);

restify.serve(app, ProblemModel);
restify.serve(app, ActivityModel);
restify.serve(app, LessonModel);

var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});
