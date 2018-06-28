var express = require('express');  
var bodyParser = require('body-parser'); 
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// Connect to the db

MongoClient.connect("mongodb://127.0.0.1/mydb", function(err, db) {
 if(!err) {
    console.log("We are connected");

app.use(express.static('public')); //making public directory as static directory  
app.use(bodyParser.json());
app.get('/', function (req, res) {  
  // console.log("Got a GET request for the homepage");  
   //res.send('<h1>Welcome to Hope Foundation </h1>'); 
	res.sendFile( __dirname + "/public/" + "index1.html" ); 
})
/*JS client side files has to be placed under a folder by name 'public' */

app.get('/index1.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "index1.html" );    
})  

app.get('/insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "insert.html" );
})
/* to access the posted data from client using request body (POST) or request (GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
	res.setHeader('Content-Type', 'text/html');
    /*response has to be in the form of a JSON*/
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
		console.log("Sent data are (POST): pupil ID :"+req.body.pupilid+" pupil Name="+req.body.pupilname);
		// Submit to the DB
  	var pupilid = req.body.pupilid;
    var pupilname = req.body.pupilname;
	var pupilage = req.body.pupilage;
	var pupilgen = req.body.pupilgen;
	db.collection('pupil').insert({pupilid:pupilid,pupilname:pupilname,pupilage:pupilage,pupilgen:pupilgen});
    res.end("pupil Inserted-->"+JSON.stringify(req.body));
    /*Sending the respone back to the angular Client */
});

//--------------------------GET METHOD-------------------------------
app.get('/process_get', function (req, res) { 
// Submit to the DB
 	 var newPup = req.query;
	var pupilid = req.query['pupilid'];
    	var pupilname = req.query['pupilname'];
	var pupilage = req.query['pupilage'];
	var pupilgen = req.query['pupilgen'];
	db.collection('pupil').insert({pupilid:pupilid,pupilname:pupilname,pupilage:pupilage,pupilgen:pupilgen});	
    	console.log("Sent data are (GET): pupilid :"+pupilid+" and pupil name :"+pupilname+"  and pupil age :"+pupilage+ " and pupil gender :"+pupilgen);
  	res.end("Pupil Inserted-->"+JSON.stringify(newPup));
}) 

//--------------UPDATE------------------------------------------
app.get('/update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})

app.get("/update", function(req, res) {
	/*var pupilid1 = req.query['pupilid'];
    	var pupilname1 = req.query['pupilname'];
	var pupilage1 = req.query['pupilage'];
	var pupilgen1 = req.query['pupilgen'];*/
	
	var pupilid1=req.query.pupilid;
	var pupilname1=req.query.pupilname;
	var pupilage1=req.query.pupilage;
	var pupilgen1=req.query.pupilgen;
    
	//-----------------------------------------
	db.collection('pupil', function (err, data) {
        data.update({"pupilid":pupilid1},{$set:{"pupilname":pupilname1, "pupilage":pupilage1, "pupilgen": pupilgen1}},{multi:true},
            function(err,result){
				if (err) {
					console.log("Failed to update data.");
			} else 
			{
				
		res.send("Pupil Updated-->"+JSON.stringify(result)+" "+"{ "+ "pupilid: "+ pupilid1+" "+"pupilname: "+pupilname1+" "+"pupilage: "+pupilage1+" "+"pupilgen: "+" "+ pupilgen1 +"}");

				
			}
        });
    });
})	
//--------------SEARCH------------------------------------------
app.get('/search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "search.html" );    
})

app.get("/search", function(req, res) {
	//var pupilidnum=parseInt(req.query.pupilid)  // if pupilid is an integer
	var pupilidnum=req.query.pupilid;
    db.collection('pupil').find({pupilid: pupilidnum}).toArray(function(err , i){
        if (err) return console.log(err)
        res.render('disp2.ejs',{pupils: i})  
     });
   /* if (err) {
      console.log(err.message+ "Failed to get data.");
    } else {
      res.status(200).json(docs);
    }
  });*/
  });
  // --------------To find "Single Document"-------------------
	/*var pupilidnum=parseInt(req.query.pupilid)
    db.collection('pupil').find({'pupilid':pupilidnum}).nextObject(function(err, doc) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {
      res.status(200).json(doc);
    }
  })
}); */

//--------------DELETE------------------------------------------
app.get('/delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "delete.html" );    
})

app.get("/delete", function(req, res) {
	//var pupilidnum=parseInt(req.query.pupilid)  // if pupilid is an integer
	var pupilidnum=req.query.pupilid;
	db.collection('pupil', function (err, data) {
        data.remove({"pupilid":pupilidnum}, function(err, result){
				if (err) {
					console.log("Failed to remove data.");
			} else { /*res.writeHeader(200,{"Content-Type":"text/plain"});
				res.write("Deleted entry");*/
				res.end("Deleted entry!");
				console.log("pupil Deleted")
			}
        });
    });
    
  });
app.get('/display', function (req, res) { 

//-------------DISPLAY USING EMBEDDED JS -----------
//console.log("In display");
 db.collection('pupil').find().sort({pupilid:1}).toArray(
 		function(err , i){
        if (err) return console.log(err)
        res.render('disp1.ejs',{pupils: i})  
     })
//---------------------// sort({pupilid:-1}) for descending order -----------//
}) 
app.get('/about', function (req, res) {  
   console.log("Got a GET request for /about");  
   //res.send('MSRIT, Dept. of CSE');  
})  
 
var server = app.listen(5000, function () {  
var host = server.address().address  
var port = server.address().port  
console.log("Example app listening at http://%s:%s", host, port)  
})  
}
else
{   db.close();  }
  
});
