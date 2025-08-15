import { EventBus } from ".";
import { ENUM_USER_EVENTS } from "./interface/user";

EventBus.on(ENUM_USER_EVENTS.USER_LOGGED_IN, (payload) => {
    console.log('USER_LOGGED_IN', payload)
})
