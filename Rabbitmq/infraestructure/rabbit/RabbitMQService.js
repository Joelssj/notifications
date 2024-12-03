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
exports.RabbitMQService = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQService {
    static getChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            // Configura la conexión solo si no está ya establecida
            if (!this.connection) {
                this.connection = yield amqplib_1.default.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@44.209.18.55');
                this.channel = yield this.connection.createChannel();
            }
            // Si `channel` sigue siendo `null`, lanza un error
            if (!this.channel) {
                throw new Error("No se pudo crear el canal de RabbitMQ");
            }
            return this.channel;
        });
    }
}
exports.RabbitMQService = RabbitMQService;
RabbitMQService.connection = null;
RabbitMQService.channel = null;
/*
// src/Notifications/infrastructure/rabbitmq/RabbitMQService.ts
import amqp from 'amqplib';

export class RabbitMQService {
  private static connection: amqp.Connection;
  private static channel: amqp.Channel;

  static async getChannel(): Promise<amqp.Channel> {
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@44.209.18.55');
      this.channel = await this.connection.createChannel();
    }
    return this.channel;
  }
}
*/ 
