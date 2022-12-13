const express = require('express');
const app = express();

const productRoutes = require('./routes');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hyeonun:qwer1234@cluster0.hx1ov9g.mongodb.net/?retryWrites=true&w=majority', {

}).then(() => console.log('mongoDb Connected ...'))
    .catch(e => console.log(e));

app.use(express.json());
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const errorHandler = (error, req, res, next) => {
    res.status(500).json({ message: error.message });
}

app.use(errorHandler);

// const PORT = 9090;
// app.listen(PORT, () => {
//     console.log(`Listening PORT ${PORT}`);
// });

module.exports = app;