/**
 * المسارات المتاحة للجميع
 * هذه المسارات لا تتطلب تسجيل دخول
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/about",
    "/services",
    "/contact",
    "/ar",
    "/en",
    "/ar/*",
    "/en/*"
];

/**
 * مسارات المصادقة
 * هذه المسارات ستقوم بإعادة توجيه المستخدمين المسجلين دخول إلى لوحة التحكم
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/error"
];

/**
 * بادئة مسارات API الخاصة بالمصادقة
 * المسارات التي تبدأ بهذه البادئة تستخدم لأغراض المصادقة
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * مسار إعادة التوجيه الافتراضي بعد تسجيل الدخول
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/admin";

/**
 * مسارات لوحة التحكم
 * هذه المسارات تتطلب تسجيل دخول كمدير
 * @type {string[]}
 */
export const adminRoutes = [
    "/admin",
    "/admin/*",
];