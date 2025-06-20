// ✅ Декодирует JWT и возвращает payload
function parseJwt(token) {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch (e) {
        console.error("Невозможно распарсить токен:", e);
        return null;
    }
}

// ✅ Возвращает роль из токена
function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = parseJwt(token);
    return decoded?.role || null;
}
