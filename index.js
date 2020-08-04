const http = require('http');
const fs = require('fs'); //fiesystem
const path = require('path');
const { parse } = require('querystring');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method == 'GET') {
        var fileUrl;
        if (req.url == '/') { fileUrl = '/index.html'; } 
        else { fileUrl = req.url; }
        var filePath = path.resolve('./public' + fileUrl); 
        const fileExt = path.extname(filePath); 

        if (fileExt == '.html') {
            fs.exists(filePath, (exists) => { 
                if (!exists) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<html><body><h1> Error 404: ' + fileUrl +
                    ' not found </h1></body></html>');

                    return;
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html');
                    fs.createReadStream(filePath).pipe(res);
                }
            });
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1> Error 404: ' + fileUrl +
            ' not an Html file </h1></body></html>');
            
            return;
        }
    }
    else if (req.method === 'POST') {
        let fileUrl = req.url;
        let filePath = path.resolve('./public' + fileUrl); 
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            fs.appendFileSync(filePath, 
                "<h1>Note Written on: " + "<br /> </h1>" + "<h3>" + 
                new Date()  + "</h3>" + "<p>" + parse(body).note + '</p>');
            res.end('Note Saved Succesfully');
            
        });
    }
    else {
        // console.log(req)
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1> Error 404: ' + req.method +
        ' not supported </h1></body></html>');
        
        return;
    }
});
server.listen(port, hostname, () => {
    console.log(`Server runnig at http://${hostname}:${port}`);
} );