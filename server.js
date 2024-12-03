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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tokenRouter_1 = require("./Token/infrestructure/routes/tokenRouter");
const RabbitMQConsumer_1 = require("./Rabbitmq/infraestructure/rabbit/RabbitMQConsumer");
const LeadCreatedConsumer_1 = require("./Rabbitmq/infraestructure/rabbit/LeadCreatedConsumer");
const PasswordResetConsumer_1 = require("./Rabbitmq/infraestructure/rabbit/PasswordResetConsumer");
const MongoTokenRepository_1 = require("./Token/infrestructure/adapters/MongoTokenRepository");
const TokenService_1 = require("./Rabbitmq/domain/TokenService");
const EmailAdapter_1 = require("./Notifications/WhatsApp/infraestructure/adapters/EmailAdapter");
const TwilioAdapter_1 = require("./Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter");
require("dotenv/config");
// Crear instancias de dependencias
const tokenRepository = new MongoTokenRepository_1.MongoTokenRepository();
const emailAdapter = new EmailAdapter_1.EmailAdapter();
const twilioAdapter = new TwilioAdapter_1.TwilioAdapter();
const tokenService = new TokenService_1.TokenService(tokenRepository, emailAdapter, twilioAdapter);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/token", tokenRouter_1.tokenRouter);
const port = 3001;
const host = "0.0.0.0";
// Inicializar consumidores de RabbitMQ
function initializeRabbitMQConsumers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("🔄 Intentando conectar a RabbitMQ...");
            // Inicializar el consumidor de `user.created`
            const rabbitMQConsumer = new RabbitMQConsumer_1.RabbitMQConsumer();
            yield rabbitMQConsumer.consumeUserCreatedEvent();
            console.log("✔️ Consumidor de user.created inicializado y escuchando eventos.");
            // Inicializar el consumidor de `lead.created`
            const leadCreatedConsumer = new LeadCreatedConsumer_1.LeadCreatedConsumer();
            yield leadCreatedConsumer.consume();
            console.log("✔️ Consumidor de lead.created inicializado y escuchando eventos.");
            // Inicializar el consumidor de `password_reset_notifications`
            const passwordResetConsumer = new PasswordResetConsumer_1.PasswordResetConsumer(); // Pasar `emailAdapter` como dependencia
            yield passwordResetConsumer.consumePasswordResetEvent();
            console.log("✔️ Consumidor de password_reset_notifications inicializado y escuchando eventos.");
            console.log("✅ Conexión a RabbitMQ y consumidores inicializados correctamente.");
        }
        catch (error) {
            console.error("❌ Error al conectar a RabbitMQ o inicializar consumidores:", error);
        }
    });
}
// Inicializar servidor y consumidores de RabbitMQ
app.listen(port, host, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀 Server online on port ${port}`);
    yield initializeRabbitMQConsumers(); // Iniciar consumidores al iniciar el servidor
}));
// Captura de errores globales para ver cualquier problema no manejado
process.on("unhandledRejection", (error) => {
    console.error("⚠️ Unhandled Rejection:", error);
});
process.on("uncaughtException", (error) => {
    console.error("⚠️ Uncaught Exception:", error);
});
