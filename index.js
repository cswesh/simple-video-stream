const express = require('express');
const fs = require('fs')

const app = express();
const port = 4545;

app.get('/',(req,res) => {
    res.sendFile(__dirname+ "/index.html");
});

app.get('/video', (req,res)=>{
    const range = req.headers.range;
    //console.log(range);
    if(!range){
        res.status(400).send("Require Range header");
    }
    const videoPath = 'vid_big.mp4';
    const videoSize = fs.statSync("vid_big.mp4").size;

    //parse range
    //example : "bytes=33325-"
    const CHUNK_SIZE = 10 ** 6; //1MB
    const start = Number(range.replace(/\D/g,""));
    console.log("start: "+start)
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    console.log("end : "+end)

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4",
    };
    res.writeHead(206,headers);
    const videoStream = fs.createReadStream(videoPath, {start,end});
    videoStream.pipe(res);
})

app.listen(port,() => {
    console.log('server is running in port'+port);
})