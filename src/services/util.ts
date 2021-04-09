export const userManagementMicroserviceUrl = () =>
    "" + process.env.USER_MANAGER_MICROSERVICE_URL
    + process.env.USER_MANAGER_MICROSERVICE_CONTEXT_PATH;
    
export const authenticatorMicroserviceUrl = () =>
    "" + process.env.AUTHENTICATOR_MICROSERVICE_URL
    + process.env.AUTHENTICATOR_MICROSERVICE_CONTEXT_PATH;