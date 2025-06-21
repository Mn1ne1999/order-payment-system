export function getToken() {
    return localStorage.getItem('token');
}
export function getUser() {
    const token = getToken();
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) { return null; }
}
export function requireRole(role) {
    const user = getUser();
    return user && user.role === role;
}
