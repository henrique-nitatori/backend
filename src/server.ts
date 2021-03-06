import DotEnv from 'dotenv';
import Path from 'path';
DotEnv.config({
    path: process.env.NODE_ENV?.trim() === "dev" ? Path.join(__dirname, 'config', 'env', '.env.testing') : ".env",
    debug: true,
})
import Express from 'express';
import Cors from 'cors';
import BodyParser from 'body-parser'
import CookieParser from 'cookie-parser'
import ExpressSession from 'express-session';
import Passport from 'passport'
import { gitHubAuthenticationRoutes } from './config/authentication/oauth/GitHub'
import { routes } from './routes'



import './config/authentication/oauth/GitHub'
const app = Express();


app.use(BodyParser.urlencoded({ extended: true }));
app.use(CookieParser())
app.use(BodyParser.json())
app.use(Cors({
    origin: 'http://localhost:3000', // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
    credentials: true // allow session cookie from browser to pass through
   }))
app.use(ExpressSession({
    name: 'session',
    secret: String(process.env.SESSION_SECRET),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 ,
        secure: false,
    },
    resave: false,
    saveUninitialized: false,
}))
app.use(Passport.initialize())
app.use(Passport.session())
app.use(gitHubAuthenticationRoutes)
app.use(routes)

 
app.listen(process.env.PORT || 4000, () => console.log('Servidor foi iniciado'))