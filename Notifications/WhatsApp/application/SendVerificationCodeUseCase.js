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
exports.SendVerificationCodeUseCase = void 0;
const Token_1 = require("../../../Token/domain/Token");
const uuid_1 = require("uuid");
class SendVerificationCodeUseCase {
    constructor(tokenRepository, twilioRepository // Usa TwilioRepository en lugar de TwilioAdapter
    ) {
        this.tokenRepository = tokenRepository;
        this.twilioRepository = twilioRepository;
    }
    run(nombre, apellido, correo, numero) {
        return __awaiter(this, void 0, void 0, function* () {
            const leadUuid = (0, uuid_1.v4)();
            // Generar el token de verificación y guardarlo en la tabla de tokens
            const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
            const token = new Token_1.Token((0, uuid_1.v4)(), leadUuid, tokenValue, new Date(Date.now() + 3600 * 1000)); // Expira en 1 hora
            yield this.tokenRepository.saveToken(token);
            // Crear el mensaje de verificación y enviarlo a través del TwilioRepository
            const message = `¡Bienvenido, ${nombre}! Tu token de verificación es: ${tokenValue}`;
            const messageLog = yield this.twilioRepository.sendMessage(numero, message); // Ahora retorna un MessageLog con fecha y metadata
            // Retornar el registro del mensaje que incluye fecha y metadata
            return messageLog;
        });
    }
}
exports.SendVerificationCodeUseCase = SendVerificationCodeUseCase;
