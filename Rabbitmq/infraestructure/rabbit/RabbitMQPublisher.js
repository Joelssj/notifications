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
exports.RabbitMQPublisher = void 0;
// src/Notifications/infrastructure/rabbitmq/RabbitMQPublisher.ts
const RabbitMQService_1 = require("./RabbitMQService");
class RabbitMQPublisher {
    publish(queue, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield RabbitMQService_1.RabbitMQService.getChannel(); // Obtén el canal desde RabbitMQService
            // Asegúrate de crear la cola si no existe
            yield channel.assertQueue(queue, { durable: true });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            console.log(`📤 Mensaje publicado en RabbitMQ en la cola ${queue}: ${JSON.stringify(message)}`);
        });
    }
}
exports.RabbitMQPublisher = RabbitMQPublisher;
