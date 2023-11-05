"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let NewAccounts = this.account.filter(acc => acc.accNumber !== accObj.accNumber);
        this.account = [...NewAccounts, accObj];
    }
}
let myBank = new Bank();
for (let i = 1; i <= 5; i++) {
    let fName = faker_1.faker.person.firstName("male");
    let lName = faker_1.faker.person.lastName();
    let num = parseInt(faker_1.faker.phone.number());
    let cus = new Customer(fName, lName, 17 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 1000 * i });
}
async function bankService(bank) {
    do {
        let service = await inquirer_1.default.prompt({
            type: "list",
            name: "select",
            message: "Please Select The Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit"]
        }); //view balance
        if (service.select == "View Balance") {
            let res = await inquirer_1.default.prompt({
                type: "input",
                name: "number",
                message: "Pease Enter Your Account Number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.number);
            if (!account) {
                console.log(chalk_1.default.red.bold.italic("Invalid Account Number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear${chalk_1.default.green.italic(name?.firstName)} ${chalk_1.default.green.italic(name?.lastName)} Your Account Balance Is ${chalk_1.default.bold.blueBright(`$${account.balance}`)}`);
            }
        } //cash withdraw
        if (service.select == "Cash Withdraw") {
            let res = await inquirer_1.default.prompt({
                type: "input",
                name: "number",
                message: "Pease Enter Your Account Number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.number);
            if (!account) {
                console.log(chalk_1.default.red.bold.italic("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer_1.default.prompt({
                    type: "number",
                    message: "Enter Your Cash Amount",
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk_1.default.red.bold("Insufficient Balance"));
                }
                let newBalance = account.balance - ans.rupee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(newBalance);
            }
        } //cash deposit
        if (service.select == " Cash Deposit") {
            let res = await inquirer_1.default.prompt({
                type: "input",
                name: "number",
                message: "Pease Enter Your Account Number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.number);
            if (!account) {
                console.log(chalk_1.default.red.bold.italic("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer_1.default.prompt({
                    type: "number",
                    message: "Enter Your Cash Amount",
                    name: "rupee",
                });
                let newBalance = account.balance + ans.rupee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(newBalance);
            }
        }
        if (service.select == "exit") {
            return;
        }
    } while (true);
}
bankService(myBank);
