const ConnectToMongo = require('./connectDB')
const express = require('express')

ConnectToMongo();
const app = express();
const port = 5000;
app.use(express.json());

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

