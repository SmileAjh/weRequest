import config from '../store/config'
import status from '../store/status'

function setParams(url: string = "", params: object) {
    const queryStringIndex: number = url.indexOf("?");
    let kvp: any = {};
    if (queryStringIndex >= 0) {
        const oldQueryString = url.substr(queryStringIndex + 1).split("&");
        // @ts-ignore
        oldQueryString.forEach((x, i) => {
            const kv: string[] = oldQueryString[i].split("=");
            kvp[kv[0]] = kv[1];
        });
    }

    kvp = {...kvp, ...params};

    const queryString = Object.keys(kvp)
        .map(key => {
            return `${key}=${encodeURI(kvp[key])}`;
        })
        .join("&");

    if (queryStringIndex >= 0) {
        return url.substring(0, queryStringIndex + 1) + queryString;
    } else {
        return url + "?" + queryString;
    }
}

function replaceDomain(url: string = "") {
    if (status.isEnableBackupDomain && config.backupDomainList && typeof config.backupDomainList === 'object') {
        for(const origin in config.backupDomainList) {
            if (url.indexOf(origin) >= 0) {
                url = url.replace(origin, config.backupDomainList[origin]);
                break;
            }
        }
    }
    return url;
}

function isInBackupDomainList(url: string = "") {
    let res = false;
    if (config.backupDomainList && typeof config.backupDomainList === 'object') {
        for(const origin in config.backupDomainList) {
            if (url.indexOf(origin) >= 0) {
                res = true;
                break;
            }
        }
    }
    return res;
}

function getNextUntriedDomain(url: string = "", triedDomains?: Set<string>): string | null {
    if (!config.backupDomainList || typeof config.backupDomainList !== 'object') {
        return null;
    }

    for (const origin in config.backupDomainList) {
        if (url.indexOf(origin) >= 0) {
            const targetDomain = getDomain(config.backupDomainList[origin]);
            // 如果目标域名还未尝试过，则返回
            if (!triedDomains?.has(targetDomain)) {
                return targetDomain;
            }
        }
    }
    return null;
}

function getDomain(url: string = ""): string {
    // 使用单个正则表达式匹配所有情况：
    // 1. http(s)://domain.com
    // 2. //domain.com
    // 3. domain.com
    const match = url.match(/^(?:https?:)?(?:\/\/)?([^/]+)/);
    return match ? match[1] : url;
}

export default {
    setParams,
    replaceDomain,
    isInBackupDomainList,
    getNextUntriedDomain,
    getDomain
};
