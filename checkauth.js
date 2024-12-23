function getCookie() {
    return document.cookie
    .split('; ')
    .find(row => row.startsWith('bearerToken='))
    ?.split('=')[1];
}

// Function to check auth token and handle redirects
async function checkAuth() {
    // Get current page path
    const currentPath = window.location.pathname;

    // Check if bearer token exists in cookies
    const token = getCookie();

    const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
    });

    const data = await response.json();

    if (!data.success && !currentPath.includes('login') && !currentPath.includes('signup')) {
        // alert('You are not logged in. Please login first before accessing this page.');

        window.location.href = '/login.html';
        return;
    }

    if (currentPath.includes('signup') && token) {

        window.location.href = '/index.html';
        return;
    }

    if (currentPath.includes('signup') && !token) {

        // alert('You are not logged in. Please login first before signing up.');

        // window.location.href = '/signup.html';
        return;
    }

    // If on login page and token exists, redirect to index
    if (currentPath.includes('login') && token) {
        window.location.href = '/index.html';
        return;
    }

    // If not on login page and no token exists, redirect to login
    if (!currentPath.includes('login') && !token) {
        window.location.href = '/login.html';
        return;
    }

    return true;
}

// Example usage in your HTML/JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    // Check auth state when page loads
    await checkAuth();
});

// Example of setting the cookie (typically done after successful login)
function setAuthCookie(token) {
    // Set cookie to expire in 24 hours
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `bearerToken=${token}; expires=${expires}; path=/; secure; samesite=strict`;

    // After setting cookie, redirect to index
    window.location.href = '/index.html';
}

export { checkAuth, getCookie };