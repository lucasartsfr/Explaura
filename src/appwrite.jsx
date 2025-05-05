import { Client, Account, Databases, Storage } from 'appwrite';

export const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('6817b682003b9ec591eb');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client); // ✅ Ajouter ceci
export { ID } from 'appwrite';
