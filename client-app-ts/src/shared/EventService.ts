export interface IEvent<T> {
    name: string;
    data?: T;
}
export interface IEventService {
    publish(event: IEvent<any>): void;
    on(
        eventType: string,
        eventListener: (data: any) => void,
        context: any
    ): IEventService;
    off(
        eventType: string,
        eventListener: (data: any) => void,
        context: any
    ): IEventService;
}
export interface IEventListener {
    function: (data: any) => void;
    context: object;
}
export interface IEventHandler {
    eventType: string;
    handler: (data: any) => void;
}

export class EventService implements IEventService {
    private eventListenerList: Map<string, IEventListener[]> = new Map<
        string,
        IEventListener[]
    >();

    public publish<T>(event: IEvent<T>): void {
        if (this.eventListenerList.has(event.name)) {
            const eventListeners = this.eventListenerList.get(event.name) || [];
            eventListeners.forEach(listener =>
                listener.function.call(listener.context, event.data)
            );
        }
    }

    public on(
        eventName: string,
        eventListener: (data: any) => void,
        context: any
    ): IEventService {
        const listenerList = this.eventListenerList.get(eventName) || [];
        listenerList.push({
            context,
            function: eventListener
        });
        this.eventListenerList.set(eventName, listenerList);

        return this;
    }

    public off(
        eventName: string,
        eventListener: (data: any) => void,
        context: any
    ): IEventService {
        if (this.eventListenerList.has(eventName)) {
            this.eventListenerList.set(
                eventName,
                (this.eventListenerList.get(eventName) || []).filter(
                    listener =>
                        listener.function !== eventListener ||
                        listener.context !== context
                )
            );
        }
        return this;
    }
}

export const eventService = new EventService();
