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
    loginFailed: {
        id: 'user-login-failed',
        msg: 'There was an error while user logging in.',
    },
    passwordNotMatched: {
        id: 'username-password-not-matching',
        msg: 'Provided username and password doesn\'t seem to be matching, please try again.',
    },
    userExists: {
        id: 'user-already-exists',
        msg: 'User with given phone number already exists.',
    },
    userLoginDetails: {
        id: 'user-login-details-missing',
        msg: 'Login details for the user are missing.',
    },
    userPhoneNumberMissing: {
        id: 'user-phone-number-missing',
        msg: 'Phone number for the user is missing.',
    },
    userEditFailed: {
        id: 'user-edit-failed',
        msg: 'There was an error while editing user.',
    },
    userDeactivationFailed: {
        id: 'user-deactivation-failed',
        msg: 'There was an error while deactivating the user.',
    },
    userLogoutFailed: {
        id: 'user-logout-failed',
        msg: 'There was an error while user logging out.',
    },
    errorGeneratingOtp: {
        id: 'error-generating-otp',
        msg: 'There was an error while generating OTP.',
    },
    errorSendingSMS: {
        id: 'error-sending-sms',
        msg: 'There was an error while sending SMS.',
    },
    userLoginValidationFailed: {
        id: 'user-login-validation-failed',
        msg: 'There was an error while user login validation.',
    },
    receivedInvalidOtp: {
        id: 'received-invalid-otp',
        msg: ' Received invalid OTP.',
    },
    onlyMRCreationIsAllowed: {
        id: 'only-MR-creation-is-allowed',
        msg: 'Only MR creation is allowed.',
    },
    userNotMR: {
        id: 'user-not-MR',
        msg: 'User is not an MR.',
    },
};

export { UserErrorCodes };
