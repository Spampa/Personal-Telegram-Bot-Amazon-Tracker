require('dotenv').config();
//libraries
const express = require('express');
const cors = require('cors');

//db
require('./db/initdb')();

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());
const PORT = process.env.PORT || 3000;

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

//log
app.use((req, res, next) => {
    console.log(`${req.method} from ${req.ip}: ${req.url}`);
    next();
})

//jobs
require('./jobs/checkProducts');

const routes = require('./routes/index');

app.use(routes.lists);
app.use(routes.products);
app.use(routes.messages);

//web socket
const checkProducts = require('./jobs/checkProducts');

io.on('connection', (socket) => {
    console.log('a user connected');

    checkProducts(socket);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});