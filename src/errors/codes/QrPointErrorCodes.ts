export const QrPointErrorCodes = {
    qrCreationFailed: {
        id: 'qr-creation-failed',
        msg: 'There was an error while generating QR code.',
    },
    qrWithBatchNumberExists: {
        id: 'qr-with-batch-number-exists',
        msg: 'QR with provided batch number already exists.',
    },
    qrValidationFailed: {
        id: 'qr-validation-failed',
        msg: 'QR validation failed.',
    },
    qrEditFailed: {
        id: 'edit-qr-failed',
        msg: 'There was an error while editing the QR.',
    },
    qrsNotFound: {
        id: 'qr-not-found',
        msg: 'Qr codes with given details not found.',
    },
    updatingBatchQuantityNotAllowed: {
        id: 'updating-batch-quantity-not-allowed',
        msg: 'Updating batch quantity is not allowed.',
    },
    qrDownloadFailed: {
        id: 'qr-download-failed',
        msg: 'Downloading QR code failed.',
    },
    noValidQrFound: {
        id: 'no-valid-qrs-found',
        msg: 'No active qr\'s found with given ID.',
    },
    productNotFound: {
        id: 'product-not-found',
        msg: 'Product with given ID not found.',
    },
    qrDownloadByBatchFailed: {
        id: 'qr-download-by-batch-failed',
        msg: 'There was an error while downloading QR\'s using batch number.',
    },
};
