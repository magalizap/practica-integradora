import winston from "winston";
import config from "../config/config.js";

const levelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "cyan"
    }
}

const loggingConfig = {
    development: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: levelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({filename: './info.log', level: 'info', format: winston.format.simple()})
    ],
    production: [
        new winston.transports.Console({
            level: 'http',
            format: winston.format.combine(
                winston.format.colorize({colors: levelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({filename: './error.log', level: 'error', format: winston.format.combine(
            winston.format.colorize({ colors: levelOptions.colors }),
            winston.format.simple()
        )}) 
    ]
}

const addLogger = (req, res, next) => {
    req.logger = winston.createLogger({
        levels: levelOptions.levels,
        transports: loggingConfig[config.app.ENV]
    })
    if(config.app.ENV === 'development'){
        req.logger.debug(`${req.method} at ${req.url} - ${new Date().toLocaleTimeString()}`)
    }else{
        req.logger.http(`${req.method} at ${req.url} - ${new Date().toLocaleTimeString()}`)
    }
    
    next()
}

export default addLogger
//para usar en la escucha al puerto
export const logger = winston.createLogger({
    transports: loggingConfig[config.app.ENV]
})
