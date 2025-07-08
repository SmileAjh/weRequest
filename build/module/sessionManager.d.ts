import { ILoginResult } from "../interface";
declare function setSession(session: Record<string, any>): void;
declare function delSession(): void;
declare function main(): Promise<void | ILoginResult>;
declare const _default: {
    main: typeof main;
    setSession: typeof setSession;
    delSession: typeof delSession;
};
export default _default;
