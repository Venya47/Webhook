import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  database: "whdb",
  dialect: "mysql",
  username: "root",
  password: "root123",
  host: "localhost",
  models: [__dirname + "/../models"], // auto load models
  logging: false,
});