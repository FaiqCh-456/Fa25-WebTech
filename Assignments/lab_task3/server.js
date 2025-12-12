const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const dummyCars = [
    { _id: 1, name: "BMW X5", category: "SUV", price: 5000, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600" },
    { _id: 2, name: "Audi A6", category: "Sedan", price: 4500, image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600" },
    { _id: 3, name: "Ford Mustang", category: "Hatchback", price: 3000, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600" }
];

app.get('/', (req, res) => {
    res.render('index', { user: null }); 
});

app.get('/about', (req, res) => {
    res.render('about', { user: null });
});

app.get('/contact', (req, res) => {
    res.render('contact', { user: null });
});

app.get('/offer', (req, res) => {
    res.render('offer', { 
        cars: dummyCars, 
        user: null,
        currentCategory: '',
        currentPage: 1,
        totalPages: 1
    });
});

app.listen(3000, () => {
    console.log("Lab Task 3 Running on http://localhost:3000");
});