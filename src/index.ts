import {runWebsocket} from "./wrapper/websockets";
import {config} from "./config_provider";

runWebsocket(config.websocketUrl, config.token, config.botName)