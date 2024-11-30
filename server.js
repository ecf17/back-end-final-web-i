import express from 'express';
import cors from 'cors';
import errorMiddleware from "./src/core/middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import corsOptions from "./src/core/config/corsConfig.js";
import userRoutes from './src/user/userRoutes.js';
import addressRoutes from "./src/address/addressRoutes.js";
import productRoutes from "./src/product/productRoutes.js";
import orderRoutes from "./src/order/orderRoutes.js";
import cartRoutes from "./src/cart/cartRoutes.js";
import categoryRoutes from "./src/category/categoryRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(errorMiddleware);

// Configurar archivos estáticos desde UPLOADS_PATH
app.use('/images', express.static(process.env.UPLOADS_PATH));

// Ruta base
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.use('/api/users', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

export { app };
