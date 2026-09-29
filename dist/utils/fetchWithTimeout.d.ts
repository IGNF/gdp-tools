export interface FetchWithTimeoutOptions extends RequestInit {
    timeoutMs?: number;
}
/** `fetch` avec délai d’expiration (évite un clic carte bloqué si le WMS ne répond pas). */
export declare function fetchWithTimeout(input: RequestInfo | URL, options?: FetchWithTimeoutOptions): Promise<Response>;
//# sourceMappingURL=fetchWithTimeout.d.ts.map