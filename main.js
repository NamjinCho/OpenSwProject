var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require("path");
var db;

var emailSchema = mongoose.Schema({
  email : String
  ,seq: { type: Number, required: true }
});
var memberSchema = mongoose.Schema({
  member_id : {type:String , required: true},
  password : {type:String , required: true}
});

connectionDB();
var memberModel = mongoose.model("members",memberSchema);
var emailModel = mongoose.model("emails",emailSchema);

//app.set('views', __dirname+'/');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

var options = {
  index: "index.html"
};

app.use(express.static(path.join(__dirname, "public"), options));
app.use(express.static(path.join(__dirname, "js")));
app.use(express.static(path.join(__dirname, "css")));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.post('/postTest',function(req,res){
  //emailModel.find();
  emailModel.findOneAndUpdate({email:req.body.email},{$set:{email:req.body.email},$inc: {seq: 1} },
     {upsert: true}, function(error, result) {
    console.log(result);
  });

  emailModel.findOne({email:req.body.email},function (err, doc){
    if (doc){
      console.log(doc.email);
      res.send("your Email is " + req.body.email +"\n"+"your numer of calling is " + doc.seq);
      }
});


  console.log("email : ", req.body.email)

});

app.post('/init',function(req,res){

    var id = req.body.id
    var data = id+"작품이 근처에 있습니다 By Server"
    res.send(data)

})

app.post('/login',function(req,res){

      db.collection('members').findOne({member_id:req.body.id},function (err,doc){

      console.log(req.body.id + " try to login\n ");

    if(!err)
    {
      console.log(req.body.id + " try to login2\n ");

      if(doc){
        console.log(req.body.id + " try to login\n ");
        if(doc.password == req.body.password)
        {
          res.send("Success");
        }
        else
        {

          res.send("Failed , Not equals to password\n");

        }
      }
      else {
          console.log("try join\n");
          var member = {member_id:req.body.id, password:req.body.password};
          //  db.collection('members').insert(member);
          db.collection('members').insert(member,function(err,result){
            if(err)
            console.log(err);
            else {
              console.log("success");
            }
          });
          res.send("success Join and Login");
      }

    }
    else {

        console.log("error2\n");

    }
    console.log("end\n");

  });
});






app.listen(3000,function(){
  console.log('Exprement')
})
function login(l_id,pass,res)
{

}
function join(l_id,pass)
{

}
function connectionDB()
{
  mongoose.connect('mongodb://namjin:opensw@ds133261.mlab.com:33261/opensw'); // 기본 설정에 따라 포트가 상이 할 수 있습니다.
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
   console.log("mongo db connection OK.");
  emailModel.findOne({email:"namjin07229@naver.com"},function (err, doc){
    if (doc){
      console.log(doc.email);
      console.log(doc.seq);
      }
});
//  console.log(findData);
  });

}
