import express from "express"
import cors from "cors"
import multer from 'multer'
import {MongoClient} from 'mongodb'
import mongoose, {Schema} from 'mongoose'




(async function () {
    const mongoClient = new MongoClient('mongodb://localhost:27017')
    const app = express()
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    app.use(express.static("public/images/test.png"));
    app.use(cors())
    await mongoClient.connect()
    mongoose.set("strictQuery", false);
    mongoose.connect('mongodb://localhost:27017', () => {
    });

    let imageSchema = new Schema({
        image: Buffer
    })

    let storage = multer.diskStorage({
        destination: "./public/images",
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' +file.originalname )
        }
    })

    let upload = multer({ storage: storage })

    const imageModel = mongoose.model('image/model', imageSchema)

    app.post("/register", upload.single('file'),async (req, res) => {
        console.log(req.file);
        const image = new imageModel({
            type: req.file,
        })
        await image.save()
        res.send('complete')
    })

    app.get('/register', async (req, res) => {
        // fs.readFile('public/images/image.png', (err, data) => {
        //     res.send(new Buffer.from(data).toString('base64'));
        // });
        const allImages = await imageModel.find()
        console.log(allImages);
        res.send(allImages)
    });

    app.listen(3005)

}())