export const config = {
    port: process.env.PORT || 3000,
    db: {
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "database": process.env.DB_NAME,
        "user": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "schema": process.env.DB_SCHEMA,
        "gamesTable": process.env.DB_GAME_TABLE,
        "usersTable": process.env.DB_USERS_TABLE
    },


    corsWhitelist: ['https://localhost:3001','http://localhost:4200'],
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