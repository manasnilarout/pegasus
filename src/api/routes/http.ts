/****************
 * HTTP Routes
 ***************/

export const User = {
    BASE: '/user',
    ID: '/:userId',
    LOGIN: '/login',
    get LOGOUT(): string {
        return `${this.ID}/logout`;
    },
    OTP: '/otp',
    get VALIDATE(): string {
        return `${this.ID}/validate`;
    },
};

export const Product = {
    BASE: '/product',
    ID: '/:productId',
};

export const Chemist = {
    BASE: '/chemist',
    ID: '/:chemistId',
};
