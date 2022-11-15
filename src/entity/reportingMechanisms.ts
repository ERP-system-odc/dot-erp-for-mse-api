
export class generalLedger{
    transaction_date:string
    description:string
    debit:number
    credit:number
    balance_debit:number
    balance_credit:number
    

}

export class trialBalance{
    account:string
    debit:number
    credit:number
}

export class incomeStatement{
    transaction_name:string
    balance:number
}
export class BalanceSheet{
    account_name:string
    account_balance:number

}