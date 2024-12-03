"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageLog = void 0;
class MessageLog {
    constructor(uuid, // ID único del mensaje
    to, // Número de teléfono o destinatario
    message, // Contenido del mensaje
    sentAt // Fecha y hora de envío
    ) {
        this.uuid = uuid;
        this.to = to;
        this.message = message;
        this.sentAt = sentAt;
    }
}
exports.MessageLog = MessageLog;
