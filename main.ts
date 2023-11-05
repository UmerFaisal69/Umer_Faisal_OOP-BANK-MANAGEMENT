import { Faker, faker } from "@faker-js/faker"
import chalk from "chalk"
import inquirer from "inquirer"

class Customer {
    firstName : string
    lastName : string
    age : number
    gender : string
    mobNumber : number
    accNumber : number

    constructor (fName : string ,lName : string ,age : number , gender : string ,mob : number ,acc : number) {
        this.firstName = fName
        this.lastName = lName
        this.age = age
        this.gender = gender
        this.mobNumber = mob
        this.accNumber = acc
    }
}

interface BankAccount {
    accNumber : number ,
    balance : number ,
}

class Bank {
    customer : Customer[] = []
    account : BankAccount[] = []

    addCustomer(obj : Customer) {
        this.customer.push(obj)
    }

    addAccountNumber(obj : BankAccount) {
        this.account.push(obj)
    }
    transaction(accObj : BankAccount){
        let NewAccounts = this.account.filter(acc => acc.accNumber !== accObj.accNumber)
        this.account = [...NewAccounts, accObj]
    }
}

let myBank = new Bank();

for(let i : number = 1; i<=5; i++){
let fName = faker.person.firstName("male")
let lName = faker.person.lastName()
let num = parseInt(faker.phone.number());
let cus = new Customer (fName, lName , 17*i ,"male", num , 1000+i ) ;
myBank.addCustomer(cus)
myBank.addAccountNumber({accNumber : cus.accNumber , balance : 1000*i})
}

async function bankService(bank:Bank) {
do{
    let service = await inquirer.prompt({
        type : "list",
        name : "select",
        message : "Please Select The Service",
        choices :["View Balance", "Cash Withdraw", "Cash Deposit"]
    
    }) //view balance
    if (service.select == "View Balance") {
        let res = await inquirer.prompt({
            type : "input",
            name : "number" ,
            message : "Pease Enter Your Account Number",
        })
        let account = myBank.account.find((acc)=>acc.accNumber == res.number)
        if(!account) {
            console.log(chalk.red.bold.italic("Invalid Account Number"))
        
        }
        if(account) {
            let name = myBank.customer.find((item)=>item.accNumber == account?.accNumber)
            console.log(`Dear${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} Your Account Balance Is ${chalk.bold.blueBright(`$${account.balance}`)}`)
        } 
    
    }  //cash withdraw
    if (service.select == "Cash Withdraw") {
        let res = await inquirer.prompt({
            type : "input",
            name : "number" ,
            message : "Pease Enter Your Account Number",
        })
        let account = myBank.account.find((acc)=>acc.accNumber == res.number)
        if(!account) {
            console.log(chalk.red.bold.italic("Invalid Account Number"))
        }    
            if(account) {
                let ans = await inquirer.prompt({
                    type : "number",
                    message : "Enter Your Cash Amount",
                    name : "rupee",
                });
                if(ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Insufficient Balance"))
                }
                let newBalance = account.balance - ans.rupee

                bank.transaction({accNumber : account.accNumber , balance : newBalance})
                console.log(newBalance)
            }
    }  //cash deposit
    if (service.select == " Cash Deposit") {
        let res = await inquirer.prompt({
            type : "input",
            name : "number" ,
            message : "Pease Enter Your Account Number",
        })
        let account = myBank.account.find((acc)=>acc.accNumber == res.number)
        if(!account) {
            console.log(chalk.red.bold.italic("Invalid Account Number"))
        }    
            if(account) {
                let ans = await inquirer.prompt({
                    type : "number",
                    message : "Enter Your Cash Amount",
                    name : "rupee",
                });
                let newBalance = account.balance + ans.rupee

                bank.transaction({accNumber : account.accNumber , balance : newBalance})
                console.log(newBalance)

            }
    }
if(service.select == "exit"){
    return
}
} while(true)

}

bankService(myBank)