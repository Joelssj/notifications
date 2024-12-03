"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenController = void 0;
// Importar repositorios y casos de uso necesarios
const MongoTokenRepository_1 = require("../adapters/MongoTokenRepository");
const ValidateTokenUseCase_1 = require("../../application/ValidateTokenUseCase");
const TokenController_1 = require("../controllers/TokenController");
const EmailAdapter_1 = require("../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter");
const RabbitMQPublisher_1 = require("../../../Rabbitmq/infraestructure/rabbit/RabbitMQPublisher");
const TwilioAdapter_1 = require("../../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter");
// Crear repositorios y adaptadores
const tokenRepository = new MongoTokenRepository_1.MongoTokenRepository();
const emailAdapter = new EmailAdapter_1.EmailAdapter();
const twilioAdapter = new TwilioAdapter_1.TwilioAdapter(); // Adaptador para Twilio
const rabbitMQPublisher = new RabbitMQPublisher_1.RabbitMQPublisher(); // Adaptador para RabbitMQ
// Crear el caso de uso para validar el token con RabbitMQ
const validateTokenUseCase = new ValidateTokenUseCase_1.ValidateUserTokenUseCase(tokenRepository, emailAdapter, twilioAdapter, // Aquí debe ir TwilioAdapter para enviar mensajes de WhatsApp
rabbitMQPublisher // Adaptador de Twilio para enviar mensajes
);
// Crear el controlador de Token
exports.tokenController = new TokenController_1.ValidateUserTokenController(validateTokenUseCase);
