let database = require(__dirname + '/database.js');
let item = require(__dirname + '/item.js');

let db = new database();


function Items() {
    let List = [];
    let activeCallback;

    this.Display = function () {
        DisplayList();
    }

    let DisplayList = function () {
        var list = '\nProduct Code\tProduct Name\t Department Name\tPrice\tStock Quantity\tDescription';
        list += '\n------------------------------------------------------------------------------------------------'
        List.forEach(x => {
            list += `\n${x.Display()}`;
        });
        console.log(list + '\n');
    }

    this.DisplayLowList = function () {
        var list = '\nProduct Code\tProduct Name\t Department Name\tPrice\tStock Quantity\tDescription';
        list += '\n------------------------------------------------------------------------------------------------'
        List.forEach(x => {
            if (x.StockQuantity <= 5) {
                list += `\n${x.Display()}`;
            }
        });
        console.log(list + '\n');
    }

    this.LoadAll = function (callback) {
        _LoadAll(callback);
    }
    let _LoadAll = function (callback) {
        let readQuery = "SELECT * FROM product";
        activeCallback = callback || activeCallback;
        db.Connect();

        db.GetConnection().query(readQuery, LoadCallback);

    }

    this.LoadByDepartment = function (department) {

    }

    let LoadCallback = function (error, result) {

        if (error) {
            console.log(error);
            db.CloseConnection();
            return;
        }

        CreateList(result);
        db.CloseConnection();
        activeCallback();
    }

    function CreateList(collection) {
        List = [];
        collection.forEach(x => {
            newItem = new item(x.uuid, x.ProductCode, x.ProductName, x.DepartmentName, x.Description, x.Price, x.StockQuantity)
            List.push(newItem);
        });

    }

    this.GetList = function () {
        return List;
    }
    this.GetProductNames = function () {
        let list = [];
        List.forEach(x => {
            list.push(`${x.ProductName} | ${x.ProductCode}`);
        });
        return list;
    }

    let GetItem = function (name, productCode) {
        let item;
        item = List.find(x =>
            x.ProductName === name && x.ProductCode === productCode
        );
        return item;

    }

    let ContainsCode = function (code) {
        return List.filter(x => {
            x.productCode === code;
        }).length > 0;
    }

    this.BuyItem = function (name, productCode, amount, callback) {
        let _amount = amount;
        let _callback = callback;
        let item = GetItem(name, productCode);
        item.Buy(_amount, _callback);
    }

    this.StockItem = function (name, productCode, amount, callback) {
        let item = GetItem(name, productCode);
        item.Restock(amount, callback);
    }

    this.AddNewItem = function (productCode, name, department, price, stock, description, callback) {
        if (ContainsCode(productCode)) {
            console.log(`Product Code: ${productCode} Already exists.`);
            callback();
        } else {
            let newItem = new item(null, productCode, name, department,description, price, stock);
            activeCallback = callback;
            newItem.AddNew(_LoadAll);
        }
    }

}

module.exports = Items;