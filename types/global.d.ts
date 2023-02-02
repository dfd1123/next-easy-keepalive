import {
    BackHistoryType,
} from "./";

export {};

declare global {
    interface Window {
        __BACK_HISTORY__?: {
            [key: string]: BackHistoryType | undefined;
        };
    }
}
