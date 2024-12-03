"use strict";
// src/Notifications/application/RabbitMQConsumer.ts
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
exports.RabbitMQConsumer = void 0;
const RabbitMQService_1 = require("./RabbitMQService");
const TokenService_1 = require("../../domain/TokenService");
const EmailAdapter_1 = require("../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter");
const MongoTokenRepository_1 = require("../../../Token/infrestructure/adapters/MongoTokenRepository");
const TwilioAdapter_1 = require("../../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter");
class RabbitMQConsumer {
    constructor() {
        const emailAdapter = new EmailAdapter_1.EmailAdapter();
        const whatsappAdapter = new TwilioAdapter_1.TwilioAdapter();
        const tokenRepository = new MongoTokenRepository_1.MongoTokenRepository();
        this.tokenService = new TokenService_1.TokenService(tokenRepository, emailAdapter, whatsappAdapter);
    }
    // Consumidor para eventos de user.created
    consumeUserCreatedEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield RabbitMQService_1.RabbitMQService.getChannel();
            const queue = 'user.created';
            yield channel.assertQueue(queue, { durable: true });
            console.log(`✔️ Escuchando eventos en la cola ${queue} para usuarios`);
            channel.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                if (msg) {
                    const event = JSON.parse(msg.content.toString());
                    console.log("📥 Evento recibido en Notifications (user.created):", event);
                    try {
                        if (event.notificationPreference === 'email') {
                            yield this.tokenService.sendVerificationToken(event.email, event.userId);
                            console.log(`✔️ Token enviado por correo a ${event.email}`);
                        }
                        else if (event.notificationPreference === 'whatsapp') {
                            if (!event.phone) {
                                throw new Error("Número de teléfono no proporcionado en el evento");
                            }
                            yield this.tokenService.sendTokenViaWhatsApp(event.phone, event.userId);
                            console.log(`✔️ Token enviado por WhatsApp al número ${event.phone}`);
                        }
                        else {
                            console.log(`❌ Preferencia de notificación desconocida para el usuario con UUID: ${event.userId}`);
                        }
                    }
                    catch (error) {
                        console.error(`❌ Error al procesar el token para ${event.email || "sin email"}:`, error);
                    }
                    channel.ack(msg); // Confirmar el mensaje como procesado
                }
            }));
        });
    }
    // Inicializar los consumidores de eventos
    initializeConsumers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumeUserCreatedEvent(); // Escuchar eventos user.created
        });
    }
}
exports.RabbitMQConsumer = RabbitMQConsumer;
/*// src/Notifications/application/RabbitMQConsumer.ts
import { RabbitMQService } from './RabbitMQService';
import { TokenService } from '../../domain/TokenService';
import { EmailAdapter } from '../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter';
import { MongoTokenRepository } from '../../../Token/infrestructure/adapters/MongoTokenRepository';


export class RabbitMQConsumer {
  private tokenService: TokenService;

  constructor() {
    const emailAdapter = new EmailAdapter();
    const tokenRepository = new MongoTokenRepository();
    this.tokenService = new TokenService(tokenRepository, emailAdapter); // Inicializa el servicio de token
  }

  async consumeUserCreatedEvent() {
    const channel = await RabbitMQService.getChannel();
    const queue = 'user.created';
    
    await channel.assertQueue(queue, { durable: true });
    console.log(`✔️ Escuchando eventos en la cola ${queue}`);

    channel.consume(queue, async (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log("📥 Evento recibido en Notifications (user.created):", event);

        try {
          // Usa el servicio para generar, guardar y enviar el token
          await this.tokenService.sendVerificationToken(event.email, event.userId);
          console.log(`✔️ Token generado, guardado y enviado a ${event.email}`);
        } catch (error) {
          console.error(`❌ Error al procesar el token para ${event.email}:`, error);
        }

        channel.ack(msg); // Confirmar el mensaje como procesado
      }
    });
  }
}


*/ 
