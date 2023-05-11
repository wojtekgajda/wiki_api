const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))


mongoose.connect('mongodb://localhost:27017/wikipediaDB', {useNewUrlParser: true})

const articleSchema = mongoose.Schema({
    title: String,
    content: String,
})

const Article = mongoose.model('Articles', articleSchema)


app.get('/', function (req, res) {
    res.render('home')
})

// ----------------All ARTICLES ------------------

app.route('/articles')
    .get(function (req, res) {
        Article.find().then((articles) => {
            res.send(articles)
        }).catch(err => {
            console.log(err)
        })
    })

    .post(function (req, res) {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        })
        article.save()
            .then(() => console.log('Article added to database'))
            .catch((err) => console.log(err))
    })
    .delete(function (req, res) {
        Article.deleteMany()
            .then(() => {
                console.log('Database cleared')
            })
            .catch(err => console.log(err))
    });

// -----------------SINGLE ARTICLE ------------------

app.route('/articles/:articleTitle')
    .get((req, res) => {
        const articleTitle = req.params.articleTitle
        Article.findOne({title: articleTitle})
            .then(result => {
                res.send(result)
            })
            .catch(err => console.log(err))
    })

    .put((req, res) => {
        const articleTitle = req.params.articleTitle
        Article.updateOne({title: articleTitle}, {
            title: req.body.title,
            content: req.body.content
        }, {overwrite: true})
            .catch(err => console.log(err))
    })

    .patch((req, res) => {
        const articleTitle = req.params.articleTitle
        Article.updateOne({title: articleTitle}, {$set: {title: req.body.title, content: req.body.content}})
            .then(()=>console.log('Record patched'))
            .catch(err => console.log(err))
    })
    .delete((req,res)=>{
        const articleTitle = req.params.articleTitle
        Article.deleteOne({title:articleTitle})
            .then(()=>console.log('Record deleted'))
            .catch(err=>console.log(err))
    })


app.listen(3000, function () {
    console.log('Server is running on port 3000')
})