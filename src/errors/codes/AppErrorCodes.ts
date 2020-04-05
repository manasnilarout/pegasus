const AppErrorCodes = {
    unknownError: {
        id:  'unknown-error',
        msg:  'An unknown error has occurred while processing this request',
    },
    recordsNotFoundError: {
        id: 'records-not-found',
        msg: 'No records found with the given criteria.',
    },
    recordsFetchError: {
        id: 'record-fetch-error',
        msg: 'There was an error while fetching the records.',
    },
};

export { AppErrorCodes };
