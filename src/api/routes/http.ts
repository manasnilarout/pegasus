/****************
 * HTTP Routes
 ***************/

export const User = {
    BASE: '/user',
    ID: '/:userId',
    LOGIN: '/login',
    MR: '/mr',
    MR_ID: '/:mrId',
    get LOGOUT(): string {
        return `${this.ID}/logout`;
    },
    OTP: '/otp',
    get VALIDATE(): string {
        return `${this.ID}/validate`;
    },
    get MR_CHEMISTS(): string {
        return `${this.MR}${this.MR_ID}/chemists`;
    },
    get MR_GIFT_ORDERS(): string {
        return `${this.MR}${this.MR_ID}/gift-order`;
    },
    get MR_CHEMIST_ORDERS(): string {
        return `${this.MR}${this.MR_ID}/chemist/orders`;
    },
    get MR_CHEMIST_CLAIMS(): string {
        return `${this.MR}${this.MR_ID}/chemist/claims`;
    },
};

export const Product = {
    BASE: '/product',
    ID: '/:productId(\d+)',
    POINTS: '/points',
    BRAND_TYPE: '/brand-type',
    PACK_TYPE: '/pack-type',
};

export const Chemist = {
    BASE: '/chemist',
    ID: '/:chemistId',
    get ORDERS(): string {
        return `${this.ID}/orders`;
    },
    get CLAIMS(): string {
        return `${this.ID}/claims`;
    },
    SPECIALTIES: '/specialties',
    SPECIALTY: '/specialty',
};

export const QR = {
    BASE: '/qr',
    QR_ID: '/:qrId',
    ID: '/batch-number/:batchNumber/batch-quantity/:batchQuantity',
    DOWNLOAD: '/:id/download',
};

export const HqQr = {
    BASE: '/hq-qr',
    ID: '/:hqQrId',
};

export const Point = {
    BASE: '/point',
    get SCAN(): string {
        return `/scan${Chemist.BASE}${Chemist.ID}${QR.BASE}${QR.QR_ID}`;
    },
    REDEEM: '/redeem',
    get REDEEM_QR(): string {
        return `${this.REDEEM}${Chemist.BASE}${Chemist.ID}${QR.BASE}${QR.QR_ID}`;
    },
    get REDEEM_POINTS(): string {
        return `${this.REDEEM}${Chemist.BASE}${Chemist.ID}` + '([0-9]+$)';
    },
    get REDEEM_OTP(): string {
        return `${this.REDEEM}${Chemist.BASE}${Chemist.ID}/otp`;
    },
    REDEMPTION: '/redemption',
};

export const LOCATION = {
    BASE: '/location',
    STATE: '/state',
    CITY: '/city',
    HQ: '/hq',
};
