export function redirectIfLoggedIn() {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    if (token) {
        window.location.href = "dashboard.html";
    }
}
export function protectPage() {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    if (!token) {
        window.location.href = "login.html";
        return null;
    }
    return token;  
}
export function getAuthHeaders() {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    return {
        Authorization: `Bearer ${token}`,
    };
}
export function handleUnauthorized(response) {
    if (response.status === 401) {
        document.cookie = "token=; path=/; max-age=0";
        window.location.href = "login.html";
        return true;
    }
    return false;
}
export function logout() {
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "login.html";
}
export function apiGet(url) {
    return fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    })
    .then((response) => {
        if (handleUnauthorized(response)) return;
        if (response.ok) return response.json();
        return response.json().then((errorData) => {
            throw new Error(errorData.message || "خطا");
        });
    });
}
export function apiPost(url, body) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(body),
    })
    .then((response) => {
        if (handleUnauthorized(response)) return;
        if (response.ok) return response.json();
        return response.json().then((errorData) => {
            throw new Error(errorData.message || "خطا");
        });
    });
}
export function apiPostNoBody(url) {
    return fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
    })
    .then((response) => {
        if (handleUnauthorized(response)) return;
        if (response.ok) return response.json();
        return response.json().then((errorData) => {
            throw new Error(errorData.message || "خطا");
        });
    });
}
