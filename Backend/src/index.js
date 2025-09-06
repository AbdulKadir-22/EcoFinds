const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});




// IMPORT ROUTE FILES
const userRoutes = require('./routes/userAuth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');



app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);





module.exports = app;