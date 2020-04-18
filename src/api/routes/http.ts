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
    REDEMPTION: '/redemption',
};
