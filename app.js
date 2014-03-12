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

var Lesson = new Schema({
    title: { type: String, required: true },
    summary: { type: String }
});
var LessonModel = mongoose.model('Lesson', Lesson);

restify.serve(app, LessonModel);


//
//var Chapter = app.chapter = restful.model('chapter', mongoose.Schema({
//        title: 'string'
//    }))
//    .methods(['get', 'post', 'put', 'delete']);
//Chapter.register(app, '/1/chapters');
//
//var Lesson = app.lesson = restful.model('lesson', mongoose.Schema({
//        title: 'string'
//    }))
//    .methods(['get', 'post', 'put', 'delete']);
//Lesson.register(app, '/1/lessons');
//
//var Activity = app.activity = restful.model('activity', mongoose.Schema({
//        title: 'string'
//    }))
//    .methods(['get', 'post', 'put', 'delete']);
//Activity.register(app, '/1/activities');


var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});
