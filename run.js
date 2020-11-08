const express = require('express');
const app = express();
const port = 1420;
var AWS = require('aws-sdk');
var multer = require('multer');
var storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,'/uploads');
    },
    filename: function (req,file,cb){
        cb(null,file.originalname);
    }
})
 
var upload = multer({storage:storage})
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
AWS.config.update({
    region: "ap-southeast-1",
    endpoint: "http://dynamodb.ap-southeast-1.amazonaws.com",
    accessKeyId: "AKIA5ZA53F5AOLOOPLUG",
    secretAccessKey: "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"
});
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
 

function findUser (res) {
    let params = {
        TableName: "SanPham"
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.log(JSON.stringify(err, null, 2));
        } else {
            if(data.Items.length === 0){
                res.end(JSON.stringify({message :'Table rỗng '}));
            }
            res.render('DanhSachSP.ejs',{
                data : data.Items
            });
        }
    });
 
}
app.get("/",(req,res)=>{
    findUser(res);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
