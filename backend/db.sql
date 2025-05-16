-- Just a sample database schema for the Messaging application
-- This is a simple schema with 3 tables: User_info, Campaign, and customer
-- Made just for someone who wants to contribute in future and needs a database schema to start with
-- This data base is not in use now, but it can be used in future
-- This is a MySQL database schema
-- You can run this script in your MySQL database to create the tables

CREATE DATABASE Messaging;
USE Messaging;

CREATE TABLE User_info (
    UserEntry_ID INT AUTO_INCREMENT PRIMARY KEY,   
    User_ID VARCHAR(100) NOT NULL UNIQUE,          
    Campaign_ID VARCHAR(100) NOT NULL UNIQUE       
);

CREATE TABLE Campaign (
    CampaignEntry_ID INT AUTO_INCREMENT PRIMARY KEY,
    Campaign_ID VARCHAR(100) NOT NULL,
    day INT NOT NULL,
    message VARCHAR(255),
    CONSTRAINT fk_campaign_campaignid
        FOREIGN KEY (Campaign_ID) REFERENCES User_info(Campaign_ID)
        ON DELETE CASCADE
);

CREATE TABLE customer (
    Customer_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID VARCHAR(100) NOT NULL,
    Campaign_ID VARCHAR(100) NOT NULL,
    Phone_no VARCHAR(20) NOT NULL,
    count INT NOT NULL,
    CONSTRAINT fk_customer_userid
        FOREIGN KEY (User_ID) REFERENCES User_info(User_ID)
        ON DELETE CASCADE,
    CONSTRAINT fk_customer_campaignid
        FOREIGN KEY (Campaign_ID) REFERENCES User_info(Campaign_ID)
        ON DELETE CASCADE
);
