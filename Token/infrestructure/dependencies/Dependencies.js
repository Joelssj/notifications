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
/*// Importar repositorios y casos de uso necesarios
import { MongoTokenRepository } from "../adapters/MongoTokenRepository";
import { ValidateUserTokenUseCase } from "../../application/ValidateTokenUseCase";
import { ValidateUserTokenController } from "../controllers/TokenController";
import { EmailAdapter } from "../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { RabbitMQPublisher } from "../../../Rabbitmq/infraestructure/rabbit/RabbitMQPublisher";
import { TwilioAdapter } from "../../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter";

// Crear repositorios y adaptadores
const tokenRepository = new MongoTokenRepository();
const emailAdapter = new EmailAdapter();
const twilioAdapter = new TwilioAdapter();
const rabbitMQPublisher = new RabbitMQPublisher(); // Instancia para enviar eventos a RabbitMQ

// Crear el caso de uso para validar el token con RabbitMQ
const validateTokenUseCase = new ValidateUserTokenUseCase(tokenRepository, emailAdapter, rabbitMQPublisher, twilioAdapter);

// Crear el controlador de Token
export const tokenController = new ValidateUserTokenController(validateTokenUseCase);*/
/*// Importar repositorios y casos de uso necesarios
import { MySQLTokenRepository } from "../adapters/MysqlTokenrepository";
import { ValidateUserTokenUseCase } from "../../application/ValidateTokenUseCase";
import { ValidateUserTokenController } from "../controllers/TokenController";
import { EmailAdapter } from "../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";

// Crear repositorios
const tokenRepository = new MySQLTokenRepository();
const userRepository = new MySQLUsersRepository();
const emailAdapter = new EmailAdapter();

// Crear el caso de uso para validar el token
const validateTokenUseCase = new ValidateUserTokenUseCase(tokenRepository, userRepository, emailAdapter);

// Crear el controlador de Token
export const tokenController = new ValidateUserTokenController(validateTokenUseCase);
*/ 
