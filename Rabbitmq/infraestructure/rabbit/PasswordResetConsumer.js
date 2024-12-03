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
exports.PasswordResetConsumer = void 0;
const RabbitMQService_1 = require("./RabbitMQService");
const EmailAdapter_1 = require("../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter");
const TwilioAdapter_1 = require("../../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter");
class PasswordResetConsumer {
    constructor() {
        this.emailAdapter = new EmailAdapter_1.EmailAdapter();
        this.twilioAdapter = new TwilioAdapter_1.TwilioAdapter();
    }
    consumePasswordResetEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield RabbitMQService_1.RabbitMQService.getChannel();
            const queue = 'password_reset_notifications';
            yield channel.assertQueue(queue, { durable: true });
            console.log(`✔️ Escuchando eventos en la cola ${queue} para restablecimiento de contraseña`);
            channel.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                if (msg) {
                    const event = JSON.parse(msg.content.toString());
                    console.log("📥 Evento recibido en Notifications (password_reset_notifications):", event);
                    const { email, token, phone, notificationPreference } = event;
                    try {
                        if (notificationPreference === 'whatsapp' && phone) {
                            // Enviar el token por WhatsApp
                            yield this.twilioAdapter.sendMessage(phone, `Su código de recuperación es: ${token}`);
                            console.log(`✔️ Código de recuperación enviado a ${phone} por WhatsApp`);
                        }
                        else {
                            // Enviar el token por correo electrónico
                            yield this.emailAdapter.sendEmail(email, 'Recuperación de contraseña', `Su código de recuperación es: ${token}`);
                            console.log(`✔️ Código de recuperación enviado a ${email} por correo`);
                        }
                    }
                    catch (error) {
                        console.error(`❌ Error al enviar el código de recuperación a ${notificationPreference === 'whatsapp' ? phone : email}:`, error);
                    }
                    channel.ack(msg);
                }
            }));
        });
    }
    initializeConsumers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumePasswordResetEvent();
        });
    }
}
exports.PasswordResetConsumer = PasswordResetConsumer;
/*import { RabbitMQService } from './RabbitMQService';
import { EmailAdapter } from '../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter';

export class PasswordResetConsumer {
  private emailAdapter: EmailAdapter;

  constructor() {
    this.emailAdapter = new EmailAdapter(); // Inicializar emailAdapter
  }

  // Consumidor para eventos de password_reset_notifications
  async consumePasswordResetEvent() {
    const channel = await RabbitMQService.getChannel();
    const queue = 'password_reset_notifications';

    await channel.assertQueue(queue, { durable: true });
    console.log(`✔️ Escuchando eventos en la cola ${queue} para restablecimiento de contraseña`);

    channel.consume(queue, async (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log("📥 Evento recibido en Notifications (password_reset_notifications):", event);

        try {
          const { email, body } = event;

          // Extraer el token del body usando una expresión regular
          const tokenMatch = body.match(/(\d{4})/); // Busca un número de 4 dígitos
          const token = tokenMatch ? tokenMatch[0] : 'undefined';

          console.log(`Token extraído para enviar en el correo: ${token}`);

          // Enviar el token al correo
          await this.emailAdapter.sendEmail(
            email,
            'Recuperación de contraseña',
            `Su código de recuperación es: ${token}`
          );
          console.log(`✔️ Código de recuperación enviado a ${email}`);
        } catch (error) {
          console.error(`❌ Error al procesar el token para ${event.email || "sin email"}:`, error);
        }

        channel.ack(msg); // Confirmar el mensaje como procesado
      }
    });
  }

  // Inicializar los consumidores de eventos
  async initializeConsumers() {
    await this.consumePasswordResetEvent(); // Escuchar eventos password_reset_notifications
  }
}
*/
