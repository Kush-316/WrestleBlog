const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = '/';

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('/');

app.post('/register',async  (req,res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e) {
        res.status(400).json(e);
    }

});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
        const UserDoc = await User.findOne({username});
        const passOk = bcrypt.compareSync(password, UserDoc.password);
        if(passOk) {
            jwt.sign({username,id:UserDoc._id}, secret, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json({
                    id: UserDoc._id,
                    username,
                });
            });
        } else {
            res.status(400).json('wrong credentials');
        }
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {title, summary, content} = req.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
    });

    res.json(postDoc);
});

app.get('/post', (req, res) => {
    Post.find();
    res.json();
});

app.listen(4000);