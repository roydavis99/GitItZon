let items = require(__dirname + '/items.js');
let inquirer = require('inquirer');


let Items = new items();


function prompt(object, callback) {
    inquirer.prompt(object).then(result => {
        callback(result);
    });
}

function LoadAll(callback) {

    Items.LoadAll(callback);
}

function Main() {
    var message = [{
        type: 'list',
        message: 'Who are you',
        name: 'selection',
        choices: ['Buyer', 'Manager']
    }];
    prompt(message, MainResult);
}

function Buy() {
    Items.Display();
    var message = [{
        type: 'list',
        message: 'Make a selection:',
        name: 'selection',
        choices: Items.GetProductNames()
    },
    {
        message: 'How Many:',
        name: 'amount'
    }];
    prompt(message, BuySelect);
}

function BuySelect(result) {

    if (isNaN(result.amount)) {
        console.log('You must specify a numeric amount!');
        Buyer();
    } else {
        let amount = parseInt(result.amount)
        let name = result.selection.split('|')[0].trim();
        let productCode = result.selection.split('|')[1].trim();
        Items.BuyItem(name, productCode, amount, Buyer);
    }
}

function Buyer() {
    var message = [{
        type: 'list',
        message: 'Make a selection:',
        name: 'selection',
        choices: ['View', 'Buy', 'Back']
    }];
    prompt(message, BuyerSelect);
}

function BuyerSelect(result) {
    switch (result.selection) {
        case 'View':
            Items.Display();
            Buyer();
            break;
        case 'Buy':
            Buy();
            break;
        case 'Back':
            LoadAll(Main);
            break;
    }
}

function AddInventory() {
    var message = [{
        type: 'list',
        message: 'Make a selection:',
        name: 'selection',
        choices: Items.GetProductNames()
    },
    {
        message: 'How Many:',
        name: 'amount'
    }];
    prompt(message, AddInventorySelect);
}

function AddInventorySelect(result) {
    if (isNaN(result.amount)) {
        console.log('You must specify a numeric amount!');
        Buyer();
    }

    let name = result.selection.split('|')[0].trim();
    let productCode = result.selection.split('|')[1].trim();
    Items.StockItem(name, productCode, result.amount, Manager);
}

function Manager() {
    var message = [{
        type: 'list',
        message: 'Make a selection:',
        name: 'selection',
        choices: ['View Products', 'Low Inventory', 'Add to Inventory', 'Create New Product', 'Back']
    }];
    prompt(message, ManagerSelect);
}

function ManagerSelect(result) {
    switch (result.selection) {
        case 'View Products':
            Items.Display();
            Manager();
            break;
        case 'Low Inventory':
            Items.DisplayLowList();
            Manager();
            break;
        case 'Add to Inventory':
            AddInventory();
            break;
        case 'Create New Product':
            break;
        case 'Back':
            LoadAll(Main);
            break;
        default:
            Manager();
            break;

    }
}

function MainResult(result) {
    //console.log(result);
    switch (result.selection) {
        case "Buyer":
            Buyer();
            break;
        case "Manager":
            Manager();
            break;
    }
}


LoadAll(Main);