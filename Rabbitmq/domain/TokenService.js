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
exports.TokenService = void 0;
const uuid_1 = require("uuid");
class TokenService {
    constructor(tokenRepository, emailAdapter, whatsappAdapter // Agregar el adaptador de WhatsApp
    ) {
        this.tokenRepository = tokenRepository;
        this.emailAdapter = emailAdapter;
        this.whatsappAdapter = whatsappAdapter;
    }
    sendVerificationToken(email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
            const token = {
                uuid: (0, uuid_1.v4)(),
                userUuid: userId,
                email: email,
                token: tokenValue,
                expiresAt: new Date(Date.now() + 3600 * 1000),
                isActive: true
            };
            yield this.tokenRepository.saveToken(token);
            console.log(`✅ Token guardado en MongoDB para el usuario ${userId}`);
            const message = `Su código de verificación es: ${tokenValue}`;
            yield this.emailAdapter.sendEmail(email, "Código de Verificación", message);
            console.log(`✔️ Correo enviado a ${email} con el token de verificación.`);
        });
    }
    sendTokenViaWhatsApp(phone, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
            const token = {
                uuid: (0, uuid_1.v4)(),
                userUuid: userId,
                phone: phone,
                token: tokenValue,
                expiresAt: new Date(Date.now() + 3600 * 1000),
                isActive: true
            };
            yield this.tokenRepository.saveToken(token);
            console.log(`✅ Token guardado en MongoDB para el usuario ${userId}`);
            const message = `Su código de verificación es: ${tokenValue}`;
            yield this.whatsappAdapter.sendMessage(phone, message);
            console.log(`✔️ Mensaje de WhatsApp enviado a ${phone} con el token de verificación.`);
        });
    }
}
exports.TokenService = TokenService;
/*import { TokenRepository } from "../../Token/domain/TokenRepository";
import { EmailAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { v4 as uuidv4 } from "uuid";

export class TokenService {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly emailAdapter: EmailAdapter,
    ) {}

    async sendVerificationToken(email: string, userId: string): Promise<void> {
        // Generar el token de verificación
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
        const token = {
            uuid: uuidv4(),               // ID único del token
            userUuid: userId,             // UUID del usuario
            email: email,                 // Correo del usuario
            token: tokenValue,            // Valor del token generado
            expiresAt: new Date(Date.now() + 3600 * 1000),  // Expira en 1 hora
            isActive: true                // Indica que el token está activo
        };

        // Guardar el token en MongoDB
        await this.tokenRepository.saveToken(token);
        console.log(`✅ Token guardado en MongoDB para el usuario ${userId}`);

        // Enviar el token por correo
        const message = `Su código de verificación es: ${tokenValue}`;
        await this.emailAdapter.sendEmail(email, "Código de Verificación", message);
        console.log(`✔️ Correo enviado a ${email} con el token de verificación.`);
    }
}*/
/*import { TokenRepository } from "../../Token/domain/TokenRepository";
import { EmailAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { v4 as uuidv4 } from "uuid";

export class TokenService {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly emailAdapter: EmailAdapter,
    ) {}

    async sendVerificationToken(email: string, userId: string): Promise<void> {
        // Generar el token de verificación
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
        const token = {
            uuid: uuidv4(),               // ID único del token
            userUuid: userId,
            email: email,           // UUID del usuario
            token: tokenValue,            // Valor del token generado
            expiresAt: new Date(Date.now() + 3600 * 1000)  // Expira en 1 hora
        };

        // Guardar el token en MongoDB
        await this.tokenRepository.saveToken(token);
        console.log(`✅ Token guardado en MongoDB para el usuario ${userId}`);

        // Enviar el token por correo
        const message = `Su código de verificación es: ${tokenValue}`;
        await this.emailAdapter.sendEmail(email, "Código de Verificación", message);
        console.log(`✔️ Correo enviado a ${email} con el token de verificación.`);
    }
}

*/
