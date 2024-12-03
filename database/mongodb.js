"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDB = exports.connectToMongoDB = void 0;
// src/database/mongodb/mongodb.ts
require("dotenv/config");
const mongodb_1 = require("mongodb");
const signale_1 = require("signale");
const signale = new signale_1.Signale();
const client = new mongodb_1.MongoClient(process.env.MONGODB_URI); // La URI completa está en .env
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            signale.success("Conexión exitosa a la BD de MongoDB");
            console.log("✔️  MongoDB conectado satisfactoriamente.");
        }
        catch (error) {
            signale.error("Error al conectar a la BD de MongoDB:", error);
        }
    });
}
exports.connectToMongoDB = connectToMongoDB;
function getMongoDB() {
    const db = client.db(); // Acceso directo a la base de datos según URI
    console.log(`🔗 Accediendo a la base de datos MongoDB: ${db.databaseName}`);
    return db;
}
exports.getMongoDB = getMongoDB;
// Llama a esta función para verificar la conexión
connectToMongoDB();
