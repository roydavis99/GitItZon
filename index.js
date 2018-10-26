let items = require(__dirname + '/items.js');
let inquirer = require('inquirer');


let Items = new items();

//console.log(Items.DisplayList());

function prompt(object, callback) {
    //console.log(object);
    inquirer.prompt(object).then(result => {
        //console.log(result);
        callback(result);
    });
}

function LoadAll(callback) {

    Items.LoadAll(callback);
}

function Main() {

    console.log('Here');
    Items.Display();
    var message = [{
        type: 'list',
        message: 'Who are you',
        name: 'selection',
        choices: ['Buyer', 'Manager']
    }];
    prompt(message, MainResult);
}


function Buyer() {
    console.log('Here');
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
    prompt(message, BuyerSelect);

}

function BuyerSelect(result) {
    if(isNaN( result.amount)){
        console.log('You must specify a numeric amount!');
        Buyer();
    }

    let name = result.selection.split('|')[0].trim();
    let productCode = result.selection.split('|')[1].trim();
    Items.BuyItem(name, productCode,result.amount, Main);
}

function MainResult(result) {
    //console.log(result);
    switch (result.selection) {
        case "Buyer":
            Buyer();
            break;
        case "Manager":
            console.log("Not set up yet");
            break;
    }
}


LoadAll(Main);