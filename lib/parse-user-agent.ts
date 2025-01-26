export function parseUserAgent(userAgent: string) {
    const ua = userAgent.toLowerCase();
    
    let deviceType = 'desktop';
    
    if (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i.test(ua)) {
        deviceType = 'mobile';
        if (/(ipad|android 3.0|xoom|sch-i800|playbook|tablet|kindle)/i.test(ua)) {
            deviceType = 'tablet';
        }
    }

    return deviceType;
}