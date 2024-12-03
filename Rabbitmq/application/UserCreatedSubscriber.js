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
exports.UserCreatedSubscriber = void 0;
// src/Notifications/application/UserCreatedSubscriber.ts
const RabbitMQService_1 = require("../infraestructure/rabbit/RabbitMQService");
class UserCreatedSubscriber {
    constructor(tokenService) {
        this.tokenService = tokenService;
        this.queue = 'user_created';
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield RabbitMQService_1.RabbitMQService.getChannel();
            yield channel.assertQueue(this.queue, { durable: true });
            console.log(`Escuchando mensajes en la cola: ${this.queue}`);
            channel.consume(this.queue, (message) => __awaiter(this, void 0, void 0, function* () {
                if (message) {
                    const content = JSON.parse(message.content.toString());
                    const { email, userId } = content;
                    console.log(`Mensaje recibido: Usuario creado - Email: ${email}, UserID: ${userId}`);
                    // Genera y envía el token al usuario a través de la API de Notifications
                    yield this.tokenService.sendVerificationToken(email, userId);
                    // Confirma el mensaje para RabbitMQ
                    channel.ack(message);
                }
            }));
        });
    }
}
exports.UserCreatedSubscriber = UserCreatedSubscriber;
