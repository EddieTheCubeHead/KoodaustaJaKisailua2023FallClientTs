import {WsEventSchema} from "./models";
import {wrapperLogProvider} from "../logging";

const _logger = wrapperLogProvider.getLogger("wrapper.deserialization")

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