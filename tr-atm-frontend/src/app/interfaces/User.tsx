export interface User {
    username: string,
    token: string
}

export interface Account {
    accountNumber: number,
    balance: string,
    cardType: string,
}

export interface PINResponse {
    username: string,
    token: string
    account_number: number,
    balance: string,
    card_type: string,
}