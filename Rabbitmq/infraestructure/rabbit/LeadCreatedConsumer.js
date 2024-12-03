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
exports.LeadCreatedConsumer = void 0;
// src/Notifications/application/LeadCreatedConsumer.ts
const RabbitMQService_1 = require("./RabbitMQService");
const EmailAdapter_1 = require("../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter");
const TwilioAdapter_1 = require("../../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter");
class LeadCreatedConsumer {
    constructor() {
        this.emailAdapter = new EmailAdapter_1.EmailAdapter();
        this.twilioAdapter = new TwilioAdapter_1.TwilioAdapter();
    }
    consume() {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield RabbitMQService_1.RabbitMQService.getChannel();
            const queue = 'lead.created';
            yield channel.assertQueue(queue, { durable: true });
            console.log(`✔️ Escuchando eventos en la cola ${queue}`);
            channel.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                if (msg) {
                    const event = JSON.parse(msg.content.toString());
                    console.log("📥 Evento recibido en Notifications (lead.created):", event);
                    const { leadUuid, correo, firstName, lastName, phone, notification_preference } = event;
                    // Guardar lead en el cache para uso posterior en user.created
                    LeadCreatedConsumer.leadCache.set(leadUuid, { phone, correo });
                    console.log(`🔍 Datos del lead almacenados temporalmente en cache para UUID ${leadUuid}:`, { phone, correo });
                    const subject = "Bienvenido a nuestra plataforma";
                    const message = `Hola ${firstName} ${lastName},\n\nGracias por unirte a nuestra plataforma. ¡Esperamos que tengas una gran experiencia!`;
                    try {
                        if (notification_preference === 'email') {
                            yield this.emailAdapter.sendEmail(correo, subject, message);
                            console.log(`✔️ Correo de bienvenida enviado a ${correo}`);
                        }
                        else if (notification_preference === 'whatsapp') {
                            yield this.twilioAdapter.sendMessage(phone, message);
                            console.log(`✔️ Mensaje de bienvenida enviado a ${phone} por WhatsApp`);
                        }
                        else {
                            console.error(`❌ Preferencia de notificación desconocida para el lead con UUID: ${leadUuid}`);
                        }
                    }
                    catch (error) {
                        console.error(`❌ Error al enviar la notificación al lead con UUID: ${leadUuid}:`, error);
                    }
                    channel.ack(msg);
                }
            }));
        });
    }
    // Método estático para obtener el teléfono de un lead desde el cache
    static getLeadData(leadUuid) {
        return this.leadCache.get(leadUuid);
    }
}
exports.LeadCreatedConsumer = LeadCreatedConsumer;
LeadCreatedConsumer.leadCache = new Map();
