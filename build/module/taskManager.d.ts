import { IRequestOption } from "../interface";
declare function setMaxQueueSize(size: number): void;
declare function getMaxQueueSize(): number;
declare function addSessionTask(task: any, obj: IRequestOption): void;
declare function abortSessionTask(): void;
declare function redoSessionTask(): void;
declare function delSessionTask(tag: string): void;
declare const _default: {
    addSessionTask: typeof addSessionTask;
    delSessionTask: typeof delSessionTask;
    abortSessionTask: typeof abortSessionTask;
    redoSessionTask: typeof redoSessionTask;
    setMaxQueueSize: typeof setMaxQueueSize;
    getMaxQueueSize: typeof getMaxQueueSize;
};
export default _default;
