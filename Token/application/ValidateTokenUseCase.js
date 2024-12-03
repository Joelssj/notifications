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
exports.ValidateUserTokenUseCase = void 0;
class ValidateUserTokenUseCase {
    constructor(tokenRepository, emailAdapter, twilioAdapter, // Utilizamos TwilioAdapter para enviar WhatsApp
    rabbitMQPublisher) {
        this.tokenRepository = tokenRepository;
        this.emailAdapter = emailAdapter;
        this.twilioAdapter = twilioAdapter;
        this.rabbitMQPublisher = rabbitMQPublisher;
    }
    run(userUuid, tokenValue) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener el token y verificar que esté activo
            const tokenData = yield this.tokenRepository.getTokenByUserUuid(userUuid);
            if (!tokenData || tokenData.token !== tokenValue || !tokenData.isActive) {
                throw new Error("Token inválido o expirado.");
            }
            // Obtener el correo del usuario antes de desactivar el token
            const email = yield this.tokenRepository.getUserEmailByUuid(userUuid);
            let recipient = null;
            if (email) {
                recipient = email;
            }
            else {
                // Si no se encuentra el correo, buscamos el teléfono
                const phone = yield this.tokenRepository.getUserPhoneByUuid(userUuid);
                if (phone) {
                    recipient = phone;
                }
                else {
                    throw new Error("Ni el correo ni el teléfono fueron encontrados para el usuario.");
                }
            }
            // Publicar el evento de activación del usuario en RabbitMQ
            yield this.rabbitMQPublisher.publish("user.token.validated", { userUuid });
            console.log(`✔️ Evento 'user.token.validated' publicado para el usuario ${userUuid}`);
            // Desactivar el token después de obtener el correo o teléfono
            yield this.tokenRepository.deactivateToken(tokenValue);
            console.log(`🚫 Token ${tokenValue} marcado como inactivo en MongoDB`);
            // Enviar la notificación de activación (por email o teléfono)
            const subject = "Bienvenido a la aplicación";
            const message = `¡Felicidades! Tu cuenta ha sido activada y ya eres parte de la aplicación.`;
            if (recipient === email) {
                // Enviar el correo de confirmación de activación
                yield this.emailAdapter.sendEmail(email, subject, message);
                console.log(`Correo de activación enviado a ${email}`);
            }
            else {
                // Enviar la notificación por WhatsApp usando Twilio
                yield this.twilioAdapter.sendMessage(recipient, message); // TwilioAdapter se encarga de enviar el mensaje
                console.log(`Notificación enviada a través de WhatsApp al número ${recipient}`);
            }
        });
    }
}
exports.ValidateUserTokenUseCase = ValidateUserTokenUseCase;
/*import { TokenRepository } from "../domain/TokenRepository";
import { EmailAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { RabbitMQPublisher } from "../../Rabbitmq/infraestructure/rabbit/RabbitMQPublisher";

export class ValidateUserTokenUseCase {
    constructor(
        private tokenRepository: TokenRepository,
        private emailAdapter: EmailAdapter,
        private rabbitMQPublisher: RabbitMQPublisher
    ) {}

    async run(userUuid: string, tokenValue: string): Promise<void> {
        // Obtener el token y verificar que esté activo
        const tokenData = await this.tokenRepository.getTokenByUserUuid(userUuid);
        if (!tokenData || tokenData.token !== tokenValue || !tokenData.isActive) {
            throw new Error("Token inválido o expirado.");
        }
    
        // Obtener el correo del usuario antes de desactivar el token
        const email = await this.tokenRepository.getUserEmailByUuid(userUuid);
        if (!email) {
            throw new Error("Correo no encontrado para el usuario.");
        }
    
        // Publicar el evento de activación del usuario en RabbitMQ
        await this.rabbitMQPublisher.publish("user.token.validated", { userUuid });
        console.log(`✔️ Evento 'user.token.validated' publicado para el usuario ${userUuid}`);
    
        // Desactivar el token después de obtener el correo
        await this.tokenRepository.deactivateToken(tokenValue);
        console.log(`🚫 Token ${tokenValue} marcado como inactivo en MongoDB`);
    
        // Enviar el correo de confirmación de activación
        const subject = "Bienvenido a la aplicación";
        const message = `¡Felicidades! Tu cuenta ha sido activada y ya eres parte de la aplicación.`;
        await this.emailAdapter.sendEmail(email, subject, message);
        console.log(`Correo de activación enviado a ${email}`);
    }
}
*/
