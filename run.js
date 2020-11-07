const express = require("express");
const app = express();
const port = 2700;
var AWS = require("aws-sdk");
var multer = require("multer");
var storege = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'/uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
})
var upload = multer({storage:storege})
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
AWS.config.update({
    region: "ap-southeast-1",
    endpoint: "http://dynamodb.ap-southeast-1.amazonaws.com",
    
});
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

/** Them sp*/
let save = function(masp,ten,sl){
    var input={
        MaSP : masp,
        TenSP : ten,
        SL:sl
    };
    var parmas = {
        TableName:"SanPham",
        Item:input
    };
    docClient.put(parmas,function(err,data){
        if(err){
            console.log("SanPham::save::error - " +JSON.stringify(err,null,2));
        }else {
            console.log("SanPham ::save::success");
        }
    });
}
app.get('/',(req,res) => { 
    res.render('index.ejs');
});


app.post('/', (req, res) => {
    var masp = req.body.txtma;
    var ten = req.body.txtten;
    var sl = req.body.txtls;
    save(masp,ten,sl);
    res.redirect('/DanhSachSV');
})
/** load sp*/
function findUser(res){
    let parmas={
        TableName:"SanPham"
    };
    docClient.scan(parmas,function(err,data){
        if(err){
            console.log(JSON.stringify(err,null,2));
        }else{
            if(data.Items.length ===0){
                res.end(JSON.stringify({message:'Table rỗng'}));
            }
            res.render('DanhSachSV.ejs',{
                data:data.Items
            });
        }
    });
}
app.get('/DanhSachSV', (req, res) => {
    findUser(res)
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
