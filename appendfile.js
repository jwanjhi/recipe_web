let fs = require('fs');

fs.appendFile('appendfile.txt','Hello World',function(err){
    if(err){throw error;}
    console.log("File saved");
});

fs.open('openfile.txt','w',function(err){
    if(err){throw error;}
    console.log("File saved");
});