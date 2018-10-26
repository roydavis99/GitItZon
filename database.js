let database = require('mysql');

const HOST = 'localhost';
const PORT = '3306';
const USER = 'root';
const PASSWORD = 'root';
const DATABASENAME = 'bamizon';

//connect function
function Database() {
    
    let connection;

    this.Connect = function() {
        connection = database.createConnection({
            host: HOST,
            // Your port; if not 3306
            port: PORT,
            // Your username
            user: USER,
            // Your password
            password: PASSWORD,
            database: DATABASENAME

        });
    };

    this.CloseConnection = function () {
        connection.end();
    }

    this.GetConnection = function(){
        return connection;
    }
}

module.exports = Database;