import { Client, Account, Databases } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6817b682003b9ec591eb');

export const account = new Account(client);
export const databases = new Databases(client); // Ajout du service Databases
export { ID } from 'appwrite';
