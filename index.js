//===============configuration======

var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var exphbs = require("express-handlebars")

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.engine('hbs', exphbs({defaultLayout: 'main', extname:'.hbs'}));
app.set('view engine','.hbs')

//============SET UP===========================
const Pool = require('pg').Pool;
var config = {
	user: 'postgres',
	database: 'resep',
	password: 'postgres',
	host: 'localhost',
	port: 5432,
	max: 10,
	idleTimeoutMillies: 30000,
};
process.on('unhandledRejection', function(e){
	console.log(e.message, e.stack)
})
var pool = new Pool(config)

//============routing=========

app.route('/')
 	.get(function(req,res){
 		// Query
 		pool.query('SELECT * from resep')
 			.then((result) => {
 				var hasil = result.rows
 				console.log('number:',hasil);

 				res.render('resep',{
 					data: hasil,
 					judul: 'Resep App with NodeJS'
 				})
 			})
 			.catch((err)=>{
 				console.error('erro running query', err);
 			});

	})
	.post(function(req, res){
		var id = req.body.id
		var nama_resep = req.body.nama_resep
		var deskripsi = req.body.deskripsi
		var penulis = req.body.penulis
		var cara_pembuatan= req.body.cara_pembuatan

		console.log(nama_resep+' '+deskripsi+' '+penulis+' '+cara_pembuatan)

		var query_post = 'insert into resep(id, nama_resep, Deskripsi, Penulis, cara_pembuatan)' + 
                            'values($1, $2, $3, $4, $5)'

        pool.query(query_post,[id, nama_resep, deskripsi, penulis, cara_pembuatan])
        	.then((result)=>{
        		console.log('Success insert data:' ,result);
        		res.redirect('/')
        	})
        	.catch((err)=>{
        		console.error('error running query', err);
        	})
	})

app.route('/detail_resep')
	.get(function(req, res){
		var ID_Resep = req.query.id
		console.log('ID:', ID_Resep)

		//1. query ID yang diinginkan
		//2. hasil query di passing render ke frontend
		var query_getSingleData = 'select * from resep where id = $1'
		pool.query(query_getSingleData, [ID_Resep])
			.then((result)=>{
				console.log('Success get single data:', result.rows[0]);
				res.render('detail_resep',{
					ID: result.rows[0].id,
					Nama_Resep: result.rows[0].nama_resep,
					Deskripsi: result.rows[0].deskripsi,
					Penulis: result.rows[0].penulis,
					Cara_Pembuatan: result.rows[0].cara_pembuatan,
				})

			})
			.catch((err)=>{
				console.error('error running query', err);
			});
	})
	.post(function(req, res){

	})

	//=============webserver======
	pool
		.query('CREATE TABLE IF NOT EXISTS resep(id SERIAL PRIMARY KEY, nama_resep VARCHAR(40) not null, deskripsi VARCHAR(40) not null, penulis VARCHAR(40) not null, cara_pembuatan VARCHAR(240) not null)')
		.then(function() {
	app.listen(5000,function(){
		console.log('server is listening on 4000')
	})
})



