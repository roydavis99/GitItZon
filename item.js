let database = require(__dirname + '/database.js');

let db = new database();

function Item(uuid, productCode, productName, departmentName, description, price, stockQuantity) {
    let _uuid = uuid;
    this.ProductCode = productCode;
    this.ProductName = productName;
    this.DepartmentName = departmentName
    this.Description = description;
    this.Price = price;
    this.StockQuantity = parseInt(stockQuantity);
    let activeCallback;

    this.Display = function () {
        return `${this.ProductCode}\t${this.ProductName}\t${this.DepartmentName}\t${this.Price}\t${this.StockQuantity}\t${this.Description}`;
    };

    this.Buy = function (units, callback) {
        //Want it to be public
        //buy the item and reduce the stock quantity buy the amount passed in
        this.StockQuantity -= parseInt(units);
        console.log('Bought: ' + units + '\nLeft: ' + this.StockQuantity);
        activeCallback = callback;

        ApplyChange(this);
    };

    this.Restock = function (units, callback) {
        this.StockQuantity += parseInt(units);
        activeCallback = callback || activeCallback;
        console.log('Stocked: ' + units + '\nAvailable: ' + this.StockQuantity);

        ApplyChange(this);
    };

    this.AddNew = function (callback) {
        activeCallback = callback;
        console.log(_uuid);
        ApplyChange(this);
    }

    let ApplyChange = function (item) { //keep hidden
        ItemDisplay();
        if (uuid === null) {
            db.Connect();
            db.GetConnection().query('INSERT INTO Product (ProductCode,ProductName,DepartmentName,Description,Price,StockQuantity) ' +
                'VALUES (?,?,?,?,?,?)', [
                    item.ProductCode,
                    item.ProductName,
                    item.DepartmentName,
                    item.Description,
                    parseFloat(item.Price),
                    parseInt(item.StockQuantity)
                ], ApplyChangeCallback);

        } else {
            db.Connect();
            db.GetConnection().query(
                "UPDATE Product SET ProductCode = ?, ProductName = ?, DepartmentName = ?, Description = ?, Price = ?, StockQuantity = ? " +
                "WHERE uuid = ?",
                [
                    item.ProductCode,
                    item.ProductName,
                    item.DepartmentName,
                    item.Description,
                    item.Price,
                    item.StockQuantity,
                    _uuid
                ],
                ApplyChangeCallback);
        }
    }

    function ApplyChangeCallback(error, result) {
        if (error) {
            console.log(error);
            db.CloseConnection();
        }
        console.log(result);
        db.CloseConnection();
        if (activeCallback) {
            activeCallback();
        }
    }
}

module.exports = Item;