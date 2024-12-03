"use strict";
/*import { TokenRepository } from "../../domain/TokenRepository";
import { Token } from "../../domain/Token";
import { query } from "../../../database/mysql/mysql";
import { RabbitMQPublisher } from "../../../Rabbitmq/infraestructure/rabbit/RabbitMQPublisher";


export class MySQLTokenRepository implements TokenRepository {
    private publisher: RabbitMQPublisher;

    constructor() {
        this.publisher = new RabbitMQPublisher(); // Inicializa el publicador de RabbitMQ
    }

    async saveToken(token: Token): Promise<void> {
        const sql = "INSERT INTO tokens (uuid, user_uuid, token, expires_at) VALUES (?, ?, ?, ?)";
        const params = [token.uuid, token.userUuid, token.token, token.expiresAt];
        await query(sql, params);

        // Publicar un evento en RabbitMQ cuando se guarde el token
        const event = {
            type: 'TokenCreated',
            data: {
                uuid: token.uuid,
                userUuid: token.userUuid,
                token: token.token,
                expiresAt: token.expiresAt,
            }
        };
        await this.publisher.publish('token.events', event); // Publicar en el exchange 'token.events'
        console.log("Evento de TokenCreated publicado en RabbitMQ");
    }

    async getTokenByUserUuid(userUuid: string): Promise<Token | null> {
        const sql = "SELECT * FROM tokens WHERE user_uuid = ?";
        const params = [userUuid];
        const [result]: any = await query(sql, params);
        
        if (result.length === 0) return null;

        const tokenData = result[0];
        return new Token(tokenData.uuid, tokenData.user_uuid, tokenData.token, tokenData.expires_at);
    }

    async deleteToken(tokenValue: string): Promise<void> {
        const sql = "DELETE FROM tokens WHERE token = ?";
        const params = [tokenValue];
        await query(sql, params);

        // Publicar un evento en RabbitMQ cuando se elimine el token
        const event = {
            type: 'TokenDeleted',
            data: {
                token: tokenValue,
            }
        };
        await this.publisher.publish('token.events', event); // Publicar en el exchange 'token.events'
        console.log("Evento de TokenDeleted publicado en RabbitMQ");
    }
}
*/
/*import { TokenRepository } from "../../domain/TokenRepository";
import { Token } from "../../domain/Token";
import { query } from "../../../database/mysql/mysql";

export class MySQLTokenRepository implements TokenRepository {
    async saveToken(token: Token): Promise<void> {
        const sql = "INSERT INTO tokens (uuid, user_uuid, token, expires_at) VALUES (?, ?, ?, ?)";
        const params = [token.uuid, token.userUuid, token.token, token.expiresAt];
        await query(sql, params);
    }

    async getTokenByUserUuid(userUuid: string): Promise<Token | null> {
        const sql = "SELECT * FROM tokens WHERE user_uuid = ?";
        const params = [userUuid];
        const [result]: any = await query(sql, params);
        
        if (result.length === 0) return null;

        const tokenData = result[0];
        return new Token(tokenData.uuid, tokenData.user_uuid, tokenData.token, tokenData.expires_at);
    }

    async deleteToken(tokenValue: string): Promise<void> {
        const sql = "DELETE FROM tokens WHERE token = ?";
        const params = [tokenValue];
        await query(sql, params);
    }
}
*/ 
