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
exports.EmailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class EmailAdapter {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '465', 10),
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    sendEmail(to, subject, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to,
                    subject,
                    text,
                });
                console.log(`✔️ Correo enviado a ${to}`);
            }
            catch (error) {
                console.error('❌ Error al enviar el correo:', error);
                throw new Error('No se pudo enviar el correo.');
            }
        });
    }
}
exports.EmailAdapter = EmailAdapter;
