
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const passport = require("passport");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const passportlocalmongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const fs = require('fs');
const path = require('path');


const app = express();

app.use(express.static("public"));


app.use(bodyParser.urlencoded({
  extended:true,
}));

app.use(fileUpload());

app.set('view engine','ejs');

app.use(session({
  secret: "Our little secret",
  resave : false,
  saveUninitialized : false,
}));

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/tourist_users_DB", {useNewUrlParser: true});
mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
  username        : String,
  email           : String,
  password        : String,
  googleid        : String,
});

const hillsSchema = new mongoose.Schema({
  tourist_place   : String,
  budget          : Number,
  days_plan       : Number,
  room_charges    : Number,
  img             : String,
  });

const pilgrimageSchema = new mongoose.Schema({
  tourist_place   : String,
  budget          : Number,
  days_plan       : Number,
  room_charges    : Number,
  img             : String,
  // type            : String,
});

const beachtripSchema = new mongoose.Schema({
  tourist_place  : String,
  budget         : Number,
  days_plan      : Number,
  room_charges   : Number,
  img            : String,
});

const teatrailsSchema = new mongoose.Schema({
  tourist_place : String,
  budget        : Number,
  days_plan     : Number,
  room_charges  : Number,
  img           : String,
});

const travellersSchema = new mongoose.Schema({
  first_name     : String,
  last_name      : String,
  no_of_members  : Number,
  start_date     : Date,
  end_date       : Date,
  phone_no       : String,
  img            : String,
  tour_package   : String,
  total_cost     : Number,
  gmail          : String,
});

const bookingSchema = new mongoose.Schema({
  gmail : String,
});



userSchema.plugin(passportlocalmongoose);
userSchema.plugin(findOrCreate);


// Creating model objects

const User = new mongoose.model("User",userSchema); //user model;
const Hill = new mongoose.model("Hill",hillsSchema);
const Temple = mongoose.model('Temple', pilgrimageSchema);
const Beachtrip = mongoose.model('Beachtrip', beachtripSchema);
const Tea = mongoose.model('Tea', teatrailsSchema);
const Traveller = mongoose.model('Traveller', travellersSchema);
const Booking = mongoose.model('Booking', bookingSchema);


passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID:  "444954450817-6tl9611gho9h80piajqr51djoor65u3i.apps.googleusercontent.com",
    clientSecret: "A8WgPjvACv0p1xtK8sxCnHN_",
    callbackURL: "http://localhost:3000/auth/google/tour_package",
    userProfileURL : "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleid: profile.id }, function (err, user) {
      return cb(err,user);
    });
  }
));

// const saltRounds = 10;

var gmail = "";

app.get("/home",function(req,res){
  console.log(gmail);
  Hill.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('home', {items:items});
      }
  });
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/", function(req,res){
  console.log(req);
  res.render("login");
});

app.get("/admin", function(req,res){
  res.render("admin");
});

app.get("/hills" ,function(req,res){
  res.render("hills");
});

app.get("/temples", function(req,res){
  res.render("temples");
});

app.get("/beach_trip", function(req,res){
  res.render("beach_trip");
});

app.get("/tea_trip", function(req,res){
  res.render("tea_trip");
});

app.get("/info_page", function(req,res){
  res.render("info_page");
});

app.get("/pages/:page",function(req,res){
  const render_page = req.params.page;
  console.log("hi" +"  "+render_page);
  if(render_page=="hills")
  {
    Hill.find({}, (err, items) => {
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred', err);
          }
          else {
              res.render('hills_page', {items:items,title:"Hill",description:"hill is a piece of land that rises higher than everything surrounding it."});
          }
      });
  }
  else if(render_page=="temples")
  {
    Temple.find({}, (err, items) => {
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred', err);
          }
          else {
              res.render('hills_page', {items:items,title:"Temple",description:"temple is a religious building that's meant for worshipping or praying. ..."});
          }
      });
  }
  else if(render_page=="tea")
  {
    Tea.find({}, (err, items) => {
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred', err);
          }
          else {
              res.render('hills_page', {items:items,title:"Tea",description:" Tea that you taste can be described as sour and sweet to spicy and earthy.."});
          }
      });
  }
  else if(render_page=="beach")
  {
    Beachtrip.find({}, (err, items) => {
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred', err);
          }
          else {
              res.render('hills_page', {items:items,title:"BeachTrip",description:"beach is just an amazing place to be, just listening to the sound of the waves.."});
          }
      });
  }

});

// app.get("/booking",function(req,res)
// {
//   Traveller.find({gmail:gmail},(err,items)=> {
//     if(err){
//         console.log("Error occured");
//     }
//     else
//     {
//        console.log(gmail);
//        var place = items[0].tour_package;
//        var no_of_members = items[0].no_of_members;
//        var total_cost = items[0].total_cost;
//        var start_date = items[0].start_date;
//        var end_date = items[0].end_date;
//        res.render("booking",{items:items,"place":place,"total_cost":total_cost,"start_date":start_date,"end_date":end_date,"no_of_members":no_of_members});
//     }
//   });
// });

app.get("/booking",function(req,res)
{
  Traveller.find({gmail:gmail},(err,items)=> {
    if(err){
        console.log("Error occured");
    }
    else
    {
       console.log(gmail);
       // var place = items[0].tour_package;
       // var no_of_members = items[0].no_of_members;
       // var total_cost = items[0].total_cost;
       // var start_date = items[0].start_date;
       // var end_date = items[0].end_date;
       res.render("booking",{items:items});
    }
  });
});



app.get("/cancel_booking",function(req,res){
  Traveller.deleteOne({gmail:gmail},(err,items)=>{
      if(err){
        console.log("Error occured");
      }
      else {
        console.log("Successfully Deleted");
        res.redirect("/home");
      }
  });
});


app.get("/addBooking/:page/:place",function(req,res){
  console.log(req.params.page);

  console.log(req.params.place);

  var id1   = req.params.page;
  var place =  req.params.place;
  console.log(gmail);
  if(place=="Hill")
  {
    Hill.find({_id:id1}, function(err, items){
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
              console.log(items[0].tourist_place);
              var place = items[0].tourist_place;
              var budget = items[0].budget;
              var room_charges = items[0].room_charges;
              var cost = budget + room_charges;
              res.render('info_page', {"place":place,"cost":cost,"gmail":gmail});
        }
    });
  }
  else if(place=="Temple")
  {
      Temple.find({_id:id1}, function(err, items){
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred', err);
          }
          else {
                console.log(items[0].tourist_place);
                var place = items[0].tourist_place;
                var budget = items[0].budget;
                var room_charges = items[0].room_charges;
                var cost = budget + room_charges;
                res.render('info_page', {"place":place,"cost":cost,"gmail":gmail});
          }
      });
   }
   else if(place=="Tea")
   {
       Tea.find({_id:id1}, function(err, items){
           if (err) {
               console.log(err);
               res.status(500).send('An error occurred', err);
           }
           else {
                 console.log(items[0].tourist_place);
                 var place = items[0].tourist_place;
                 var budget = items[0].budget;
                 var room_charges = items[0].room_charges;
                 var cost = budget + room_charges;
                 res.render('info_page', {"place":place,"cost":cost,"gmail":gmail});
           }
       });
    }
    else if(place=="BeachTrip")
    {
        BeachTrip.find({_id:id1}, function(err, items){
            if (err) {
                console.log(err);
                res.status(500).send('An error occurred', err);
            }
            else {
                  console.log(items[0].tourist_place);
                  var place = items[0].tourist_place;
                  var budget = items[0].budget;
                  var room_charges = items[0].room_charges;
                  var cost = budget + room_charges;
                  res.render('info_page', {"place":place,"cost":cost,"gmail":gmail});
            }
        });
     }
});



// app.get('/tour_package',function(req,res){
//   res.render("tour_package");
// });

app.get("/auth/google",
passport.authenticate('google',{ scope : ["profile"] }));

app.get("/auth/google/",
  passport.authenticate('google',{failureRedirect:"/login"}),
  function(req,res){
    //successful authentication it takes to secrets page
    console.log("login");
    res.render("home");
  }
);
// upload.single('image')
app.post('/hills',  (req, res, next) => {

    if(!req.files)
    {
      console.log("file not found");
    }
    else
    {
      const files = req.files.image;
      const image_name = files.name;
      if(files.mimetype=="image/jpeg"||files.mimetype=="image/png")
      {
          files.mv("uploads/"+image_name,function(err){
                if(err)
                {
                    console.log("error");
                }
                else
                {
                  const obj = new Hill({
                    tourist_place: req.body.tourist_spot,
                    budget: req.body.budget,
                    days_plan: req.body.days_plan,
                    room_charges: req.body.room_charges,
                    img: image_name
                  });
                  obj.save();
                  res.redirect("/");
                }
          });
      }
    }
});

app.post('/temples',(req, res, next) => {

  if(!req.files)
  {
    console.log("file not found");
  }
  else
  {
    const files = req.files.image;
    const image_name = files.name;
    if(files.mimetype=="image/jpeg"||files.mimetype=="image/png")
    {
        files.mv("uploads/"+image_name,function(err){
              if(err)
              {
                  console.log("error");
              }
              else
              {
                const obj1 = new Temple({
                  tourist_place: req.body.tourist_spot,
                  budget: req.body.budget,
                  days_plan: req.body.days_plan,
                  room_charges: req.body.room_charges,
                  img: image_name
                });
                obj1.save();
                res.redirect("/");
              }
        });
    }
  }
});
//
app.post('/beach_trip',(req, res, next) => {

  if(!req.files)
  {
    console.log("file not found");
  }
  else
  {
    const files = req.files.image;
    const image_name = files.name;
    if(files.mimetype=="image/jpeg"||files.mimetype=="image/png")
    {
        files.mv("uploads/"+image_name,function(err){
              if(err)
              {
                  console.log("error");
              }
              else
              {
                const obj = new Beachtrip({
                  tourist_place: req.body.tourist_spot,
                  budget: req.body.budget,
                  days_plan: req.body.days_plan,
                  room_charges: req.body.room_charges,
                  img: image_name
                });
                obj.save();
                res.redirect("/");
              }
        });
    }
  }
});

app.post('/tea_trip', (req, res, next) => {

  if(!req.files)
  {
    console.log("file not found");
  }
  else
  {
    const files = req.files.image;
    const image_name = files.name;
    if(files.mimetype=="image/jpeg"||files.mimetype=="image/png")
    {
        files.mv("uploads/"+image_name,function(err){
              if(err)
              {
                  console.log("error");
              }
              else
              {
                const obj = new Tea({
                  tourist_place: req.body.tourist_spot,
                  budget: req.body.budget,
                  days_plan: req.body.days_plan,
                  room_charges: req.body.room_charges,
                  img: image_name
                });
                obj.save();
                res.redirect("/");
              }
        });
    }
  }
});

app.post('/info_page', (req, res) => {

  if(!req.files)
  {
    console.log("file not found");
  }
  else
  {
    const files = req.files.img_upload;
    const image_name = files.name;

    console.log(image_name);

    if(files.mimetype=="image/jpeg"||files.mimetype=="image/png")
    {
          files.mv("public/uploads/"+image_name,function(err){
              if(err)
              {
                  console.log(err);
                  console.log("error");
              }
              else
              {

                 const obj = new Traveller({
                  first_name: req.body.Name1,
                  last_name: req.body.Name2,
                  no_of_members: req.body.number,
                  phone_no: req.body.phone_no,
                  start_date: req.body.start,
                  end_date: req.body.end,
                  img: image_name,
                  tour_package: req.body.tour_package,
                  total_cost: req.body.total_cost * req.body.number,
                  gmail: req.body.gmail,
                });

                obj.save();
                res.redirect("/home");
              }
           });
     }
  }
});




app.post('/register', function(req,res){
  User.register({username: req.body.username, email: req.body.email}, req.body.userpassword, function(err,user){
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/login");
        console.log(req.body.username);
        console.log(req.body.password);
        passport.authenticate("local")(function(req,res){
        res.redirect("/");
        });  //type of authentication that we're performing is local
      }
  });
});

app.post("/login", function(req,res){
  const user = new User ({
    email : req.body.email,
    password : req.body.password,
  });
  console.log(res.statusCode);
  req.login(user,function(err){
    if(err){
      console.log(user.email);
      console.log(err);
    }
    else{
      gmail = req.body.email;
      res.redirect("/home");
      passport.authenticate("local")(req,res,function(){
        res.redirect("http://localhost:3000/auth/google/home");
      });
    }
  });
});

app.listen(3000,function(req,res){
  console.log("Server running on port 3000");
});
