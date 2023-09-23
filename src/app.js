import express from 'express';
import __dirname from './utils.js';

import usersRouter from './routes/users.router.js';
import coursesRouter from './routes/courses.router.js';
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js'

import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';

import addLogger, { logger } from './middleware/logger.middleware.js';
import swaggerJsdoc from  'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const app = express();
const PORT = config.app.PORT
mongoose.connect(config.mongo.URL)

/**
 * Swagger config
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'API Práctica Integradora',
            description: 'Documentación sobre la integración actual'
        },
    },
    //apis: [`${__dirname}/docs/**.yaml`]
    apis:[`${process.cwd()}/src/docs/**.yaml`]
}

const spec = swaggerJsdoc(swaggerOptions)


/**
 * Template engine
 */
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

/**
 * Middlewares
 */
app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

initializePassport();
app.use(passport.initialize());
app.use(cookieParser());
app.use(addLogger)
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

app.use('/',viewsRouter)
app.use('/api/users',usersRouter);
app.use('/api/courses',coursesRouter);
app.use('/api/sessions',sessionsRouter);

app.use('/loggerTest', (req, res) => {
    req.logger.info('Info')
    req.logger.debug("Debug")
    req.logger.http("Http")
    req.logger.warning("Warning")
    req.logger.error("Error")
    req.logger.fatal("Fatal")
    res.send('Probando Logger')
})



app.listen(PORT,()=> logger.info(`Listening on PORT ${PORT}`))