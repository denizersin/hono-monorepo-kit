export const getEmailUrl = () => {
    return process.env.EMAIL_URL || "http://localhost:3000";
}

export const getAppUrl = () => {
    return process.env.APP_URL || "http://localhost:3000";
}
