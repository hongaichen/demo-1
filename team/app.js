let express = require('express');
const artTemplate = require('art-template');
const express_template = require('express-art-template');
const multer = require('multer');

const fs = require("fs");

// const upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
    //设置上传文件保存的路径
    destination: function (req, file, cb) {
        let url = './uploads';
        dirExists(url);
        cb(null, url);
    },
    //设置上传文件名
    filename: function (req, file, cb) {
        // file.originalname 上传文件的原名包后缀
        cb(null, Date.now() + "-" + file.originalname)
    }
})
var upload = multer({ storage: storage });


let app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', __dirname + '/view');
app.engine('html', express_template);
app.set('view engine', 'html');


app.get('/app', (req, res) => {
    res.render('app.html');
})

//多文件上传
app.post('/mput', upload.array('fileList'), (req, res) => {
    console.info("mput   " + req.files);
    res.json({
        code: 200,
        desc: "成功"
    })
})

//单文件上传
app.post("/upload", upload.single('singleFile'), (req, res) => {
    res.json({
        code: 200,
        desc: "成功"
    })
})

/**
 * 判断路径是否存在，不存在就创建
 * @param {*} url 
 */
function dirExists(url) {
    try {
        fs.accessSync(url);
    } catch (error) {
        fs.mkdirSync(url, { recursive: true })
    }
}

app.listen(4000)