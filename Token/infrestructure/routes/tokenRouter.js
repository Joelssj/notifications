"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenRouter = void 0;
const express_1 = __importDefault(require("express"));
const Dependencies_1 = require("../dependencies/Dependencies"); // Asegúrate de que uses el nombre correcto (minúsculas o mayúsculas)
exports.tokenRouter = express_1.default.Router();
exports.tokenRouter.post("/validar-token", Dependencies_1.tokenController.run.bind(Dependencies_1.tokenController));
