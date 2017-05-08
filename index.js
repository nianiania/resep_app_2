//===============configuration======

var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var exphs = require("express-handlebars")

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.engine('hbs', exphs({defaultLayout: 'main', extname:'.hbs'}));
app.set('view engine','.hbs')

//============routing=========

app.route('/')
 	.get(function(req,res){
 		res.render('resep');

	})
	.post(function(req, res){
		var nama_resep = req.body.nama_resep
		var deskripsi = req.body.deskripsi
		var penulis = req.body.penulis
		var cara_pembuatan= req.body.cara_pembuatan

		console.log(nama_resep)
		console.log(deskripsi)
		console.log(penulis)
		console.log(cara_pembuatan)
	})

	//=============webserver======

	app.listen(5000,function(){
		console.log('ini contoh web sederhana dengan node js')
	})