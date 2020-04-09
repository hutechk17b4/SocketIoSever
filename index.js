var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var mysql= require("mysql");
var fs = require("fs");
server.listen(process.env.PORT || 3000);

console.log("Sever running");





// connect Database
	// 2 dấu _
	var connection=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'',
		database:'film_booking',
		port:3306
	});

	//=============================
	connection.connect((err)=>{
		if (!err) {
			console.log('DB connection succeded');
		}
		else
		{
			console.log('DB connection failed');
		}
	});

//================ query
io.sockets.on('connection',function(socket){
	console.log("Co thiet bi vua ket noi");
	// 	connection.query('SELECT * FROM khachhang',function(err,rows,fields){
	// 		if(err) throw err;
	// 		console.log('the solution is: ',rows);
	// });
//INSERT INTO phim(`IDphim`) SELECT * FROM(SELECT ?) as tmp WHERE NOT EXISTS(SELECT IDphim FROM phim WHERE IDphim = ?)LIMIT 1;

//===================IDPHIM và TÊN PHIM
	socket.on('client-send-data',function(data){
		socket.on('client-send-data-title',function(data2){
				console.log("Sever nhan: "+data+" "+data2);
					var sql="INSERT INTO phim(`IDphim`,`TenPhim`) SELECT * FROM(SELECT ?,?) as tmp WHERE NOT EXISTS(SELECT `IDphim`,`TenPhim` FROM phim WHERE IDphim = '?')LIMIT 1;";
					var values= [data,data2];
					sql=connection.format(sql,values);
					connection.query(sql,function(err,rows,fields){
					if(err) console.log("Sever da add: "+data+" "+data2);
			//console.log('the solution is: ',rows);
				});

		});
			
	});
//==================================ID thể loại=data3=================================
	socket.on('client-send-genreid',function(data3){
		console.log("Sever nhan IDtheloai: "+data3);
		var sql="INSERT INTO theloai(`IDTheLoai`) SELECT * FROM(SELECT ?) as tmp WHERE NOT EXISTS(SELECT `IDTheLoai` FROM theloai WHERE IDTheLoai = '?')LIMIT 1;";
		var values=[data3];
		sql=connection.format(sql,values);
		connection.query(sql,function(err,rows,fields){
			if(err) console.log("sever da add: " +data3);
		});
	});
	//====================================================================================

	socket.on('client-send-data',function(data){
		socket.on('client-send-genreid',function(data3){
			var sql="INSERT INTO theloaiphim(ID,IDTheLoai,IDphim) VALUES(null,?,?);";
			var values=[data3,data];
			sql=connection.format(sql,values);
			connection.query(sql,function(err,rows,fields){
				if (err) console.log("sever da add: "+data+"va"+data3);
			});
		});
	});
//====================================== data=IDphim,data2=TenPhim,data3=IDTheLoai
	
});

	
	
	