let database = require(__dirname + '/database.js');

let db = new database('localhost', '3306', 'root', 'root', 'bamizon');

function Item(uuid, productCode, productName, departmentName, description, price, stockQuantity) {
    let _uuid = uuid;
    this.ProductCode = productCode;
    this.ProductName = productName;
    this.DepartmentName = departmentName
    this.Description = description;
    this.Price = price;
    this.StockQuantity = stockQuantity;
    let activeCallback;

    this.Display = function () {
        return `${this.ProductCode}\t${this.ProductName}\t${this.DepartmentName}\t${this.Price}\t${this.StockQuantity}\t${this.Description}`;
    };

    this.Buy = function (units, callback) { 
        //Want it to be public
        //buy the item and reduce the stock quantity buy the amount passed in
        this.StockQuantity -= units;
        console.log('Bought: ' + units +'\nLeft: ' + this.StockQuantity);
        activeCallback = callback;// || activeCallback;
        //console.log('Bought: ' + units +'\nLeft: ' + this.StockQuantity);
        //ApplyChange();

    };

    this.Restock = function (units, callback) {
        this.StockQuantity += units;
        activeCallback = callback || activeCallback;

        ApplyChange();
    };

    let ApplyChange = function () { //keep hidden
        if (uuid === '') {
            db.Connect();

            db.GetConnection().query('INSERT INTO Product SET ?', {
                ProductCode: this.ProductCode,
                ProductName: this.ProductName,
                DepartmentName: this.DepartmentName,
                Description: this.Description,
                Price: this.Price,
                StockQuantity: this.StockQuantity
            }, InsertCallback);

        } else {

        }


    }
    function InsertCallback(error, result) {
        if (error) {
            console.log(error);
            connection.end();
        }
        console.log(result);
        db.CloseConnection();
        if (activeCallback) { activeCallback(); }
    }


}

module.exports = Item;