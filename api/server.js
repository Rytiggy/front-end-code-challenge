const express = require('express'),
      bodyParser = require('body-parser'),
      locations = require('./routes/locations'),
      cors = require('cors')


const app = express()

app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/api/locations', locations)
app.listen(process.env.PORT || 3001)
