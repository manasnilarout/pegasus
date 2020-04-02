const UserErrorCodes = {
    userServiceError: {
        id: 'user-service-error',
        msg: 'There was an error while some user operation.',
    },
    usernameExists: {
        id: 'username-already-exists',
        msg: 'User with provided username already exists.',
    },
    userValidationFailed: {
        id: 'user-validation-failed',
        msg: 'User validation failed.',
    },
    userNotFound: {
        id: 'user-not-found',
        msg: 'User with given id not found',
    },
    findingUserFailed: {
        id: 'finding-user-failed',
        msg: 'There was an error while finding user.',
    },
};

export { UserErrorCodes };
