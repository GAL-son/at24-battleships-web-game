export const config = {
    port: process.env.PORT || 3000,
    db: {
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "database": process.env.DB_NAME,
        "user": process.env.DB_USER,
        "password": process.env.DB_PASSWORD
    },
    corsWhitelist: ['https://localhost:3001'],
    corsOptions: {
        origin: function (origin: any, callback: any) {
            if(!origin){//for bypassing postman req with  no origin
                return callback(null, true);
            }
            if (config.corsWhitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    },
    saltRounds: 4,
    jwtKey: process.env.JWT_KEY
}