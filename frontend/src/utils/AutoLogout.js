let timeout;

export const startAutoLogout = (logoutFunction, timeoutDuration = 15 * 60 * 1000) => { 
    // ✅ Auto logout after 15 minutes of inactivity
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        logoutFunction();
    }, timeoutDuration);
};

export const resetAutoLogout = (logoutFunction) => {
    document.addEventListener("mousemove", () => startAutoLogout(logoutFunction));
    document.addEventListener("keydown", () => startAutoLogout(logoutFunction));
};
