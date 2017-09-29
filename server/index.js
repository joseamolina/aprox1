import {graphql, GraphQLString} from 'graphql';
import bodyParser from 'body-parser';
import express from 'express';

const {
    PORT = "8080"
} = process.env;

function AllowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:9000');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(AllowCrossDomain);

var mysql = require('mysql');
var result;
//32 digit -- 128b
//const key = UNHEX('F3229A0B371ED2D9441B830D21A390C3');

//Access the database
var con = mysql.createConnection({
    host: "localhost",
    user: "jamolina",
    password: "Marxengels17",
    database: "mydb"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected");

    var queryUsers = "SELECT * FROM users";
    con.query(queryUsers, function (err2, result) {

        if (err2 || result.length == 0 ){
            console.log("Table users was not created before!");

            const queryCreation = "CREATE TABLE users (username VARCHAR(10), password VARCHAR(20))";

            con.query(queryCreation, function (err3, result) {
                if(!err3) console.log("users table was created!");

                else{
                    console.log("Table was already created!");

                    const username = "user1";
                    const password = "holamundo95";

                    var queryInstertion = "INSERT INTO users (username, pwd) VALUES ('"+ username + "', '" + password + "')";

                    con.query(queryInstertion, function (err4, result) {

                        if(!err4){

                            console.log("Main user was introduced properly!");
                            con.query(queryUsers, function (err5, result2) {
                                //console.log(result2);
                            });
                        }else console.log("Not possible to introduce the main user!");
                    });
                }
            });

        }else{
            console.log("All constraints are correct so far!!!")
            //console.log(result);
        }
    });
});

//A partir de ahora el servidor empieza a escuchar todas las request.
app.listen(PORT, (err, result) => {
    if (err) {
        throw err;
    }
    console.log(`Listening at localhost:${PORT}`);
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        username: {type: GraphQLString},
        password: {type: GraphQLString}
    })
});

const UserQuery = new GraphQLObjectType({
    name: 'UserQuery',
    fields: {
        user: {
            type: UserType,
            // `args` describes the arguments that the `product` query accepts
            args: {
                username: { type: GraphQLString }
            },
            resolve: function (_, args) {
                var queryRequest = "SELECT * FROM users WHERE username = '" + args.username + "'" ;
                var resultFinal;
                con.query(queryRequest, function (err, result) {
                    if (err) throw err;
                    resultFinal = result;
                })

                return resultFinal;
            }
        }
    }
});







//Define different methods for retrieving data through REST fw


/*Obtener la informacion de data -things-
*No persiste en db
* Mejorar
*/
