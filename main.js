var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db;
var emailSchema = mongoose.Schema({
  email : String
  ,seq: { type: Number, required: true }
});
var memberSchema = mongoose.Schema({
  id : String,
  password : String
});

connectionDB();
var emailModel = mongoose.model("emails",emailSchema);
var memberModel = mongoose.model("members",memberSchema);
app.set('views',__dirname+'/');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);


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
app.post('/login',function(req,res){
  login(req.body.id,req.body.password,res);

});


  console.log("email : ", req.body.email)

});

app.get('/',function(req,res){
  res.status(200).render('index.html')
  //res.send('helloWorld')
});


app.listen(3000,function(){
  console.log('Exprement')
})
function login(l_id,pass,res)
{
  memberModel.findOne({id:l_id},function (err,doc){
    if(!err)
    {
      if(doc){
        console.log(l_id + " try to login\n ");
        if(doc.password == pass)
        {
          res.send("Success");
        }
        else {
          res.send("Failed , Not equals to password\n");
        }
      }
      else {
        join(l_id,pass);
        login(l_id,pass);
      }
    }
  });
}
function join(id,pass)
{
  memberModel.save(function(err){
    if(!err)
    {
      console.log("Success Join");
    }
  });
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
