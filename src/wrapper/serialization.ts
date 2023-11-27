import {WsEventSchema} from "./models";
import {loggerProvider} from "../logging";

const _logger = loggerProvider.getLogger("wrapper.deserialization")

export const deserializeWebhookEvent = (jsonString: string) => {
    const parseResult = WsEventSchema.safeParse(
        JSON.parse(jsonString)
    )

    if (!parseResult.success) {
        _logger.error(`Failed parsing webhook event from the string '${jsonString}'`)
        return null;
    }

    return parseResult.data;
}