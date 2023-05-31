var express = require('express');
var router = express.Router();

const fs = require('fs');

let imgNumber = 1; // number of image (grab from database)
let imgName = ""; // stores the final name of the image file

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bekonix Test Page' });
});

function callback(err){
  if (err) console.log(err);
}

router.post('/post_page.html', function(req, res, next) {
  var BlockInfo=req.headers['x-camblock'];
  console.log("BlockInfo: "+BlockInfo+" Body Size:"+req.body.length);

  if (req.body.length && BlockInfo){
    var args=BlockInfo.split(",");

    var imageId = args[2];  // unique identifier for the image

    // If this is the first block of the image, set the name of the image
    if (args[0] == 1) {
      
      console.log("First Block Received");
      let date = new Date(); // get current date

      // get each value of the date
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // add 1 since month starts at 0
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();

      // get 2 digit string for each value, add "0" to front if value is single digit
      let yearString = ("" + year).slice(-4);
      let monthString = ("0" + month).slice(-2);
      let dayString = ("0" + day).slice(-2);
      let hourString = ("0" + hour).slice(-2);
      let minuteString = ("0" + minute).slice(-2);

      // get the 6 digit string number, add "0" to front if less than 6 digits
      let imgNumberString = ("00000" + imgNumber).slice(-6);

      // concatenate all the strings together to get the image name
      imgName = "img_" + imgNumberString + "_" + yearString + "_" + monthString + "-" + dayString + "_" + hourString + minuteString + ".jpeg";
      console.log("imgName", imgName);
    }

    // set the file path the image gets written to
    var path=process.cwd() + "/output/" + imgName;

    // first block, overwrite the file from scratch
    if (args[0]==1){
      fs.writeFile(path, req.body, callback);
    }
    // blocks that come after the first, add the data to the end of the file
    else {
      fs.appendFile(path, req.body, callback);
    }
    // this is the final block, because the block number equals the total blocks
    if (args[0]==args[1]){
        // transfer the image to the database with the name we gave it
        console.log("Transfer Complete");
        imgNumber++; // update the image number (in the database)
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