"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeWebhookEvent = void 0;
const models_1 = require("./models");
const logging_1 = require("../logging");
const _logger = logging_1.wrapperLogProvider.getLogger("wrapper.deserialization");
const deserializeWebhookEvent = (jsonString) => {
    const parseResult = models_1.WsEventSchema.safeParse(JSON.parse(jsonString));
    if (!parseResult.success) {
        _logger.error(`Failed parsing webhook event from the string '${jsonString}'`);
        return null;
    }
    return parseResult.data;
};
exports.deserializeWebhookEvent = deserializeWebhookEvent;
