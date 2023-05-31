var express = require('express');
var router = express.Router();

const fs = require('fs');

let imageCounter = 0;  // global counter for the image
let imageSessions = {};  // object to hold image session data

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bekonix Test Page' });
});

function callback(err){
  if (err) console.log(err);
}

router.post('/post_page.html', function(req, res, next) {
  var BlockInfo=req.headers['x-camblock'];

  if (req.body.length && BlockInfo){
    var args=BlockInfo.split(",");

    var imageId = args[2];  // unique identifier for the image

    // If this is the first block of this image, create a new session
    if (args[0] == 1) {
      imageCounter++;

      // Get current date and time
      let date = new Date();

      // Format date and time
      let formattedDate = ("0" + date.getDate()).slice(-2) + ("0" + (date.getMonth() + 1)).slice(-2) + date.getFullYear().toString().slice(-2);
      let formattedTime = ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2);

      // Format image counter
      let formattedCounter = ("000000" + imageCounter).slice(-6);

      imageSessions[imageId] = `img_${formattedCounter}_${formattedDate}_${formattedTime}.jpeg`;
    }

    var path=process.cwd() + "/output/" + imageSessions[imageId];

    if (args[0]==1){
      fs.writeFile(path, req.body, callback);
    }
    else {
      fs.appendFile(path, req.body, callback);
    }
    if (args[0]==args[1]){
        console.log("Transfer Complete");
        delete imageSessions[imageId];  // cleanup session
    }
  }
  else {
    res.status(204).send();
    return;
  }

  res.end('It worked!');
  return;
  res.status(204).send();
});

router.get('/Output/:imageFile', function(req, res, next) {
  var path=process.cwd()+"/output/"+req.params.imageFile;
  res.sendFile(path);
});

module.exports = router;
