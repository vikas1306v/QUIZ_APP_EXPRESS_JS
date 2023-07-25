const express=require('express')
const app=express()
const PORT=process.env.PORT || 3000
const connectToMongoDb =require('./db/conn.js')
connectToMongoDb()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/auth',require('./controllers/auth.js'))
app.use('/api/category',require('./controllers/categoryRoutes.js'))
app.use('/api/question',require('./controllers/questionsRoutes.js'))
app.use('/api/quiz',require('./controllers/quizRoutes.js'))

app.listen(PORT,()=>{
    console.log('Server is up on port '+PORT)
})