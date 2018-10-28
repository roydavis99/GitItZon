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
        let readQuery = "SELECT * FROM product";
        activeCallback = callback;
        db.Connect();

        db.GetConnection().query(readQuery, LoadCallback);

    }

    this.LoadByDepartment = function (department) {

    }

    LoadCallback = function (error, result) {

        if (error) {
            console.log(error);
            db.CloseConnection();
            return;
        }

        //console.log(result);
        CreateList(result);
        //DisplayList();
        db.CloseConnection();
        activeCallback();
    }

    function CreateList(collection) {
        this.List = [];
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
        item = List.filter(x =>
            x.ProductName === name && x.ProductCode === productCode
        );
        return item;

    }

    this.BuyItem = function (name, productCode, amount, callback) {
        console.log('Buy Item');
        let item = GetItem(name, productCode);
        console.log(item);
        callback();
        //item.Buy(amount, callback);
    }

    this.StockItem = function(name, productCode, amount, callback){
        let item = GetItem(name,productCode);
        item.Restock(amount, callback);
    }

}

module.exports = Items;