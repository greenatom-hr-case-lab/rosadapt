const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/list', require('./routes/list.routes'))
app.use('/api/create', require('./routes/create.routes'))
app.use('/api/delete', require('./routes/delete.routes'))
app.use('/api/change', require('./routes/change.routes'))

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()

