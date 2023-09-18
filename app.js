const express = require('express'); 
const mongoose = require('mongoose');
const Book = require('./models/Books') 

const app = express(); 

// mongodb connection
const dburi = 'mongodb+srv://walter:walterrific@cluster0.nyg0auu.mongodb.net/Books?retryWrites=true&w=majority'; 

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('Listening on port 3000 . . .')
        })
    })
    .catch((err) => {
        console.log({error: err});
    })

app.set('view engine', 'ejs'); 
app.use(express.static('public')); 
app.use(express.urlencoded({extended: true})); 

app.get('/', (req, res) => {
    Book.find()
        .then((result) => {
            res.render('home', {books: result, title: 'Home'}); 
        })
        .catch((err) => {
            res.send('Error fetching data'); 
        })
})

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
})

app.get('/insert', (req, res) => {;
    res.render('insert', {title: 'Insert'})
})

app.post('/', (req, res) => {
    const book = new Book(req.body)
    
    book.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => res.send(err));
})

app.get('/:id', (req,res) => {
    const id = req.params.id; 

    Book.findById(id)
        .then((result) => {
            res.render('details', {book: result, title: 'Details'}); 
        })
        .catch(err => res.send(err)); 
})

app.delete('/:id', (req, res) => {
    const id = req.params.id; 

    Book.findByIdAndDelete(id)
        .then((result) => {
            res.json({redirect: '/'});
        })
        .catch((err) => {
            res.send('Delete Request Failed'); 
        })
})

app.use((req, res) => {
    res.render('404.ejs', {title: '404'}); 
})