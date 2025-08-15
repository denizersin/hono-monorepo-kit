import { tblLog } from "@repo/shared/schema";
import db from "@server/modules/infrastructure/database";
import { EventEmitter } from "events";
import { ENUM_ALL_EVENT_IDS, EVENT_SETTINGS, TBaseEventLogData, TGlobalEvents } from "./interface";
import { ENUM_CHARACTER_EVENTS } from "./interface/character";
import { ENUM_USER_EVENTS } from "./interface/user";

export class TypedEventEmitter<Events extends Record<string, any>> {
    private emitter = new EventEmitter();
    private globalListeners: Array<(eventName: keyof Events, payload: any) => void> = [];

    on<K extends keyof Events>(eventName: K, listener: (payload: Events[K]['props']) => void) {
        this.emitter.on(eventName as string, listener);
    }

    emit<K extends keyof Events>(eventName: K, payload: Events[K]['props']) {
        // Trigger global listeners before emitting the specific event
        this.globalListeners.forEach(listener => {
            try {
                listener(eventName, payload);
            } catch (error) {
                console.error(`Error in global listener for event ${String(eventName)}:`, error);
            }
        });

        this.emitter.emit(eventName as string, payload);
    }

    off<K extends keyof Events>(eventName: K, listener: (payload: Events[K]['props']) => void) {
        this.emitter.off(eventName as string, listener);
    }

    // Add global listener that captures all events
    onGlobal(listener: (eventName: keyof Events, payload: Events[keyof Events]['props']) => void) {
        this.globalListeners.push(listener);
    }

    // Remove global listener
    offGlobal(listener: (eventName: keyof Events, payload: Events[keyof Events]['props']) => void) {
        const index = this.globalListeners.indexOf(listener);
        if (index > -1) {
            this.globalListeners.splice(index, 1);
        }
    }
}



export const EventBus = new TypedEventEmitter<TGlobalEvents>();





EventBus.onGlobal(async (eventName, payload) => {

    console.log('eventName', eventName)
    if (payload.type === ENUM_CHARACTER_EVENTS.CHARACTER_CREATED) {



    }


    if (payload.type === ENUM_USER_EVENTS.USER_CREATED) {

    }



    if (!EVENT_SETTINGS[payload.type]?.withoutLog && payload.logData) {
        await db.insert(tblLog).values({
            eventId: ENUM_ALL_EVENT_IDS[payload.type],
            eventName: payload.type,
            eventData: {
                ...payload.logData,
            } as TBaseEventLogData<typeof payload.type>,
            createdAt: new Date(),
        })
    }


})


