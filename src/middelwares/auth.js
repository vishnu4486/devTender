export const adminAuth = (req, res, next) => {
    let token = "abc";
    const isAdminAuthorization = token == "abc";
    if (isAdminAuthorization) {
        next();
    } else {
        res.status(401).send("admin is not authorise");
    }
}
export const userAuth = (req, res, next) => {
    let token = "abc";
    const isAdminAuthorization = token == "abc";
    if (isAdminAuthorization) {
        next();
    } else {
        res.status(401).send("user is not authorise");
    }
}