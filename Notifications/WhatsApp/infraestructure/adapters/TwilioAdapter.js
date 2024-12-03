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
exports.TwilioAdapter = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class TwilioAdapter {
    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
        const authToken = process.env.TWILIO_AUTH_TOKEN || '';
        this.from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM || ''}`;
        if (!accountSid || !authToken || !this.from) {
            throw new Error('Error: Faltan las credenciales de Twilio en el archivo .env');
        }
        this.client = (0, twilio_1.default)(accountSid, authToken);
    }
    sendMessage(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cleanNumber = to.replace(/[^\d]/g, '');
                let formattedNumber = cleanNumber;
                if (!cleanNumber.startsWith('521')) {
                    formattedNumber = `521${cleanNumber}`;
                }
                const whatsappTo = `whatsapp:+${formattedNumber}`;
                const response = yield this.client.messages.create({
                    from: this.from,
                    to: whatsappTo,
                    body: message
                });
                console.log(`Mensaje enviado correctamente con SID: ${response.sid}`);
                console.log(`Estado del mensaje: ${response.status}`);
            }
            catch (error) {
                console.error('Error al enviar el mensaje de Twilio:', error);
                throw new Error('No se pudo enviar el mensaje de verificación.');
            }
        });
    }
}
exports.TwilioAdapter = TwilioAdapter;
