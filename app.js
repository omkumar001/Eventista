const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

//using EJS as a view engine
app.set("view engine", "ejs");

//Using the Body parser packager installed
app.use(bodyParser.urlencoded({ extended: true }));

//for loading all the CSS as well as the JS files while on server
app.use(express.static("public"));


var pastEventsList=[];
var DOE=[];
var errlog={erruname:"",errpass:""};
var logflag=1;
var uname="";
var Role="";


//MySQL
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'eventista'
});
 



connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log("Eventista DB Successfully Connected !!");
});





app.get("/pastEvents/:Org_username", function (req, res) {
   //res.sendFile(__dirname + "/views/index.html");
  //res.render("index");

  connection.query("SELECT *  from events,details where events.EventId = details.EventId AND events.Org_username = ? order by DOEvent asc",[req.params.Org_username],function(err,rows){

    if(err) {
    console.log(err);
    }
    else{

var doe = new Date();
var options={day:"numeric" , month:"numeric" , year:"numeric"};

for(var i=0;i<rows.length;i++){
 doe = rows[i].DOEvent.toLocaleDateString("en-US", options);
 DOE.push(doe);
}

    res.render("pastEvents",{pastEventsList:rows, DOEList:DOE,username:uname});
        }
  });

});



// app.get("/", function (req, res) {
//   //res.sendFile(__dirname + "/views/index.html");

//   console.log(req.params.uname+" "+uname);

//   if(uname==""){
//     res.render("index");
//   }
//   else{
//     res.render("index",{username:uname});
//   }
  
// });




app.get("/", function (req, res) {

    connection.query('SELECT * from details ', function(err, rows) {

        if (!err) {
          res.render("index",{EvePosters: rows,username:uname,role:Role});
        } 
        else {
        console.log(err)
        }

        // for (let i = 0; i < rows.length; i++) {
        //   console.log('The data from user table are: \n', rows[i]);
        // }
  });

  //console.log(""==uname);

  console.log(req.params+" "+uname);

  // if(uname==""){
  //   res.render("index");
  // }
  // else{
  //   res.render("index",{username:uname});
  // }
  
});




app.get("/login", function (req, res) {
 // res.sendFile(__dirname + "/views/login.html");

 if(logflag==0){
  res.render("login",{warn:errlog});

  logflag=1;
  errlog.erruname="";
  errlog.errpass="";
  
 }
 else{
 res.render("login",{warn:errlog});
   }
});





// app.get("/signup", function (req, res) {
//  // res.sendFile(__dirname + "/views/signin.html");
//   res.render("signup");
// });


//signup
app.get("/signup", function (req, res) {
 
  if(req.body.role == "organiser"){
    Role = "organiserProfile";
    res.render("signup",{role: Role});
  }
  else{
    Role = "attendeeProfile";
    res.render("signup",{role: Role, doob: req.body.dob });
  }
    
});




//Description Page
app.get("/description/:EventId", function (req, res) {
  
  let day1 = new Date();
  let day2 = new Date(); 
  let options = { day: "numeric",month: "long", year: "numeric" };

    connection.query('SELECT * from events JOIN evesocialmedia ON events.EventId=evesocialmedia.EventId JOIN details ON details.EventId = events.EventId AND details.EventId = ?', [req.params.EventId] , function(err, rows) {
       
      
      if (!err) {

          day1 = rows[0].DOEvent.toLocaleDateString("en-US",options);
          day2 = rows[0].Deadline.toLocaleDateString("en-US",options);

          res.render("description",{
            eventPoster: rows[0].Poster, 
            EveName: rows[0].Ename, 
            Category: rows[0].Category, 
            DEve: day1, 
            venue: rows[0].Venue,
            deadL: day2, 
            maxP: rows[0].MaxParticipants,
            organiser: rows[0].Org_username,  
            descp: rows[0].Description, 
            EId: rows[0].EventId,
            Instagram: rows[0].Instagram,
            Facebook: rows[0].Facebook,
            Twitter: rows[0].Twitter,
            username:uname,role:Role
            });
        }
       else {
        console.log(err)
        }
        //console.log('The data from table are: \n', rows[0].Poster);
    });

    // console.log(uname);

});





app.post("/description/:EventId",function (req,res){

    connection.query("INSERT INTO Bookmarks(Att_username,EventId) VALUES ('"+uname+"',"+req.params.EventId+")", function(err,rows) {

      if(!err){
        console.log("Bookmark Entered...");
        res.redirect("/description/"+req.params.EventId);
      } 
      else {
        console.log(err);
      }

    });

});





// app.get("/booking", function (req, res) {
//   //res.sendFile(__dirname + "/views/booking.html");
//   res.render("booking");
// });



//Booking Page

let eveId;
app.get("/booking/:EventId", function (req, res) {
  
  connection.query('SELECT EventId,GoldTicketPrice,DiamondTicketPrice,PlatinumTicketPrice from events where EventId = ?',[req.params.EventId] , function(err, rows) {
      
    if (!err) {
    eveId = rows[0].EventId;
    res.render("booking",{Gold: rows[0].GoldTicketPrice, Diamond: rows[0].DiamondTicketPrice, Platinum: rows[0].PlatinumTicketPrice, EId:eveId });
      } 
    else {
     console.log(err);
    }

  });

});


app.post("/booking/:EventId", function (req, res) {
  
  const ticketType = req.body.TypeOfticket;
  const notickets = req.body.NOTickets;
  const totalPrice = req.body.totalPrice;
  
  connection.query("INSERT INTO tickets (Att_username,EventID,TypeOfticket,NOTickets,TotalPrice) VALUES ('"+uname+"',"+eveId+",'"+ticketType+"',"+notickets+","+totalPrice+")" , function(err,rows) {
      
    if (!err) {
        res.redirect("/");
      }
      else {
      console.log(err)
      }
      
  })

});




app.get("/contact", function (req, res) {
  // res.sendFile(__dirname + "/views/contact.html");
  res.render("contact");
});



app.get("/attendeeProfile/:Att_username", function (req, res) {
  
  let dofB = new Date();
  let options = { day: "numeric",month: "long", year: "numeric" };
  connection.query("Select * from attendee where Att_username = ?",[req.params.Att_username], function(err,rows) {
    if(err)
      console.log(err);
    else{
      dofB = rows[0].DateOfBirth.toLocaleDateString("en-US",options);
      res.render("attendeeProfile",{
        attName: rows[0].AttName,
        attEmail: rows[0].AttEmail,
        attUser: rows[0].Att_username,
        dob: dofB,
        age: rows[0].Age
      });
    }
  })
});



// app.get("/attendeeProfile", function (req, res) {
//   //res.sendFile(__dirname + "/views/attendeeProfile.html");
//   res.render("attendeeProfile");
// });



// app.get("/organiserProfile", function (req, res) {
//   //res.sendFile(__dirname + "/views/attendeeProfile.html");
//   res.render("organiserProfile");
// });



app.get("/createEvent/:username", function (req, res) {
  //res.sendFile(__dirname + "/views/attendeeProfile.html");
  res.render("createEvent");
});





//Creating an event
app.post("/createEvent", function (req, res) {
 
  var field = req.body;
 console.log(field);

 //res.redirect("/");

  connection.query("insert into events(Category, GoldTicketPrice,DiamondTicketPrice, PlatinumTicketPrice, MaxParticipants,Ename) values(' "+field.category+" ',' "+ field.goldTicketPrice +" ',' "+field.diamondTicketPrice+" ',' "+field.platinumTicketPrice+" ',' "+field.maxParticipant +" ',' "+field.eventname+" ')", function(err, rows) {

   if (!err){
    res.redirect("/");
    // if ends here
    } 
    else{
    console.log(err)
     }
});


var eventId="";

  connection.query("select * from events",function(err,rows){

    if(err){
    console.log(err);
      }
  else{
         eventId=rows[rows.length-1].EventId;
         console.log(eventId);

         connection.query("insert into details(EventId,Deadline,Venue,DOEvent,Description,Poster) values('"+eventId+"','"+field.Deadline+"','"+ field.venue +"','"+field.DOE+"','"+field.eventDetails+"','"+field.posterURL +"')", function(err, rows) {

             if (!err) {
             console.log("data inserted into details");
             } 
             else {
             console.log(err)
             }
          }); // insertion into details finsihed


          connection.query("insert into evesocialmedia(EventId,Instagram,Facebook,Twitter) values('"+eventId+"','"+field.insta+"','"+ field.fb +"','"+field.twitter+"')", function(err, rows) {

            if (!err) {
            console.log("data inserted into evesocialmedia");
            } 
            else {
            console.log(err)
            }
         }); // insertion into evesocialmedia finsihed


        }
  }); //selecting from the event table ends

 });
  //post event ends








  app.post("/signup", function (req, res) {

    var field = req.body;
    console.log(field);

    var role=field.role;

    if(role =="organiser")
    {
      connection.query("insert into organizer(Org_username,OrgEmail,OrgName,OrgPassword) values('"+field.username+"','"+ field.email +"','"+field.name+"','"+field.password1+"')", function(err, rows) {
        if (!err){

      connection.query("insert into orgsocialmedia(Org_username,Instagram,Facebook,Twitter) values('"+field.username+"','None','None','None')", function(errr,row){
            if(!errr)
              res.redirect("/login");
            else
              console.log(errr);
          });
        //  res.redirect("/login");
         // if ends here
         } 
         else{
         console.log(err)
          }
     });

    }
  else
  {
    connection.query("insert into attendee(Att_username,AttEmail,AttName,AttPassword,DateOfBirth) values('"+field.username+"','"+ field.email +"','"+field.name+"','"+field.password1+"','"+field.dob+"')", function(err, rows) {
      if (!err){
       res.redirect("/login");
       // if ends here
       } 
       else{
       console.log(err)
        }
     });
  }
   
   
  });
//connection.end();







app.post("/login", function (req, res) {

  var field = req.body;
   var flag=0;

  connection.query("select * from attendee",function(err,rows){
    if(err){
    console.log(err);
      }
      else{

        for( i=0;i<rows.length;i++)
        {
          if(field.username == rows[i].Att_username && field.password == rows[i].AttPassword)  {
            flag=1;
            console.log(flag+" Attendee"); 
          }
        }
        
        if(flag==1){
          uname=field.username;
          Role = "attendeeProfile";
          console.log("Credentials match of the attendee!!");
          res.redirect("/");
        }
      else
       {
      connection.query("select * from organizer",function(err,rows){
        if(err){
        console.log(err);
          }
         else{

            for( i=0;i<rows.length;i++) {

              if(field.username == rows[i].Org_username && field.password == rows[i].OrgPassword){
                flag=1;
                console.log(flag+" Organiser"); 
              }
            }
  
            if(flag==1){
              console.log("Credentials match  of the organiser!!");
              uname=field.username;
              Role = "organiserProfile";
              res.redirect("/");
            }
            else{
              logflag=0;
              console.log("Credentials don't match !!");
              
              errlog.erruname="Please enter the correct username !!";
              errlog.errpass="Please enter the correct password !! ";
              res.redirect("login");
            }

          }   
      });

    }//else ends here

      }

    });

});






//Show Organiser's Profile
app.get("/showProfile/:Org_username", function(req,res) {

  connection.query("Select * from organizer,orgsocialmedia where organizer.Org_username = orgsocialmedia.Org_username AND organizer.Org_username = ?",[req.params.Org_username],function(err,rows) {

    if(err)
      console.log(err);
    else{
      res.render("showProfile",{
        orgName: rows[0].OrgName,
        orgEmail: rows[0].OrgEmail,
        orgUser: rows[0].Org_username,
        orgContact: rows[0].ContactNo,
        organisation: rows[0].Organisation,
        Instagram: rows[0].Instagram,
        Facebook: rows[0].Facebook,
        Twitter: rows[0].Twitter,
        username:uname
      });
    }
  });

  //console.log("Show profile : "+uname);

});





//Organisers Profile
app.get("/organiserProfile/:Org_username", function(req,res) {

  connection.query("Select * from organizer,orgsocialmedia where organizer.Org_username = orgsocialmedia.Org_username AND organizer.Org_username = ?",[req.params.Org_username],function(err,rows) {

    if(err)
      console.log(err);
    else{
      res.render("organiserProfile",{
        orgName: rows[0].OrgName,
        orgEmail: rows[0].OrgEmail,
        orgUser: rows[0].Org_username,
        orgContact: rows[0].ContactNo,
        organisation: rows[0].Organisation,
        Instagram: rows[0].Instagram,
        Facebook: rows[0].Facebook,
        Twitter: rows[0].Twitter
      });
    }
  });
});



//for logout
app.get("/logout", function(req,res) {
  uname = "";
  Role="";
  res.redirect("/");
});





//for editProfile
app.get("/editProfile/:uname", function(req,res) {

  var usename=uname;

  if(Role=="organiserProfile")
  {
    
    connection.query("Select * from organizer,orgsocialmedia where organizer.Org_username = orgsocialmedia.Org_username AND organizer.Org_username = ?",[uname],function(err,rows) {
      if(err)
      console.log(err);
      else{
        res.render("editProfile",{username:uname,role:Role,name:rows[0].OrgName,orgname:rows[0].Organisation,email:rows[0].OrgEmail,pass:rows[0].OrgPassword,contact:rows[0].ContactNo, Instagram: rows[0].Instagram, Facebook: rows[0].Facebook, Twitter: rows[0].Twitter});
      }
   });
    
  }
  else
  {
    connection.query("Select * from attendee where attendee.Att_username = ?",usename,function(err,rows) {
      if(err)
      console.log(err);
      else{

        var dob = new Date();
        var options={day:"numeric" ,month:"numeric" , year:"numeric"};
        dob = rows[0].DateOfBirth.toLocaleDateString("en-US", options);
     
        res.render("editProfile",{username:uname, role:Role ,name:rows[0].AttName ,email:rows[0].AttEmail ,pass:rows[0].AttPassword ,doob:dob});
        
      }
    });

  }
  
});





app.post("/editProfile/:uname", function(req,res) {

  var field=req.body;

  if(Role=="organiserProfile") {

  connection.query('UPDATE organizer SET OrgName = ?, OrgPassword = ?, ContactNo = ?, Organisation = ? , OrgEmail= ? WHERE Org_username = ?',[field.fullname,field.password1,field.contactno,field.orgname,field.email,uname],function(err,rows) {
    if(err)
    console.log(err);
    else{

      connection.query('UPDATE orgsocialmedia SET Instagram = ?, Facebook = ?, Twitter = ? WHERE Org_username = ?',[field.insta,field.facebook,field.twitter,uname], function (errr,row){
        if(errr)
          console.log(errr);
        else
        //console.log(row);
          console.log("Social Media handle updated.");
      });

      res.redirect("/"+Role+"/"+uname);
        }
    });
  }//if ends

     else{
      connection.query('UPDATE attendee SET AttName = ?, AttPassword = ?,  DateOfBirth = ? , AttEmail= ? WHERE Att_username = ?',[field.fullname,field.password1,field.dob,field.email,uname],function(err,rows) {
        if(err)
        console.log(err);
        else{
          res.redirect("/"+Role+"/"+uname);
        }
      });

    }//else ends
    
});






//Bookmarks
app.get("/bookmarks/:Att_username", function(req,res) {

  connection.query("Select events.Ename,events.Category,events.MaxParticipants,details.DOEvent from bookmarks JOIN events on bookmarks.EventId = events.EventId JOIN details on bookmarks.EventId = details.EventId AND bookmarks.Att_username = ? ",[req.params.Att_username], function(err,rows) {
    if(!err){
      var doe = new Date();
      var options={day:"numeric" , month:"long" , year:"numeric"};

      let DateOfE = [];
      for(var i=0;i<rows.length;i++){
      doe = rows[i].DOEvent.toLocaleDateString("en-US", options);
      DateOfE.push(doe);
      }

     res.render("bookmarks",{bookList: rows, DOEList: DateOfE});
    }
    else
      console.log(err);
  })
});





//My Tickets
app.get("/tickets/:Att_username", function(req,res) {

  connection.query("Select events.Ename,details.DOEvent,TypeOfticket,NOTickets,TotalPrice from tickets JOIN events on tickets.EventId = events.EventId JOIN details on tickets.EventId = details.EventId AND tickets.Att_username = ? ",[req.params.Att_username], function(err,rows) {
    if(!err){
      var doe = new Date();
      var options={day:"numeric" , month:"long" , year:"numeric"};

      let DateOfE = [];
      for(var i=0;i<rows.length;i++){
      doe = rows[i].DOEvent.toLocaleDateString("en-US", options);
      DateOfE.push(doe);
      }

     res.render("tickets",{ticketList: rows, DOEList: DateOfE});
    }
    else
      console.log(err);
  })
});





app.listen(3000, function () {
  console.log("Server started at the port 3000.");
});
