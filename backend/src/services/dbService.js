const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.PUBLIC_IP,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

async function addUser(user) {
    const {User_ID, Campaign_ID} = user;  
    const [result] = await pool.query('INSERT INTO User_info (User_ID, Campaign_ID) VALUES (?, ?)', [User_ID, Campaign_ID]);
    return result
}

async function addCampaign(campaign) {
    const {Campaign_ID, day, message} = campaign;  
    const [result] = await pool.query('INSERT INTO Campaign (Campaign_ID, day, message) VALUES (?, ?, ?)', [Campaign_ID, day, message]);
    return result;
}

async function addCustomer(customer){
    const {User_ID, Campaign_ID, Phone_no, count} = customer;
    const [result] = await pool.query('INSERT INTO customer (User_ID, Campaign_ID, Phone_no, count) VALUES (?, ?, ?, ?)', [User_ID, Campaign_ID, Phone_no, count]);
    return result;
}

async function getCustomer(campaign){
    const {Campaign_ID} = campaign;
    const [result] = await pool.query('SELECT * FROM customer WHERE Campaign_ID = ?', [Campaign_ID]);
    return result;
} 

module.exports = { addUser, addCampaign, addCustomer, getCustomer };