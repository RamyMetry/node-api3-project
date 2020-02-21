require('dotenv').config()
const server = require('./server');

const port=process.env.PORT
const host=process.env.DB_HOST

server.listen(port, () => {
	console.log(`server is listening on ${host}:${port}`);
});
