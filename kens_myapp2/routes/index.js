var express = require('express');
var router = express.Router();

const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bekonix Test Page' });
});


function callback(err){
  console.log(err);
}

router.post('/post_page.html', function(req, res, next) {
  //res.render('index', { title: 'Something New' });

  //console.log("Body size; "+req.body.length);
  var BlockInfo=req.headers['x-camblock'];
  console.log("BlockInfo: "+BlockInfo+" Body Size:"+req.body.length);

  if (req.body.length && BlockInfo){
    var args=BlockInfo.split(",");

    var path=process.cwd()+"/output/out.jpeg";

    if (args[0]==1){
      fs.writeFile(path, req.body, callback);
    }
    else {
      fs.appendFile(path, req.body, callback);
    }
    if (args[0]==args[1]){
        console.log("Transfer Complete");
    }

  }
  else {
    res.status(204).send();
    return;
  }


  res.end('It worked!');
  return;


//  res.statusMessage="TESTTEST12345";
//  return res.sendStatus(204);

  //204 No Content, the client doesn't need to navigate away from its current page
  res.status(204).send();
});



router.get('/Output/out.jpeg', function(req, res, next) {

  var path=process.cwd()+"/output/out.jpeg";
  res.sendFile(path);
});

module.exports = router;
