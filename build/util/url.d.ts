declare function setParams(url: string | undefined, params: object): string;
declare function replaceDomain(url?: string): string;
declare function isInBackupDomainList(url?: string): boolean;
declare function getNextUntriedDomain(url?: string, triedDomains?: Set<string>): string | null;
declare function getDomain(url?: string): string;
declare const _default: {
    setParams: typeof setParams;
    replaceDomain: typeof replaceDomain;
    isInBackupDomainList: typeof isInBackupDomainList;
    getNextUntriedDomain: typeof getNextUntriedDomain;
    getDomain: typeof getDomain;
};
export default _default;
