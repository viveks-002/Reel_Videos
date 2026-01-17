import { protectRoute } from './auth.js';
import { CONFIG } from './config.js';

// Route protect karo
if (protectRoute()) {
    const initProfile = async () => {
        // URL se ID nikalna (?id=xxx)
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');

        if (!userId) {
            window.location.href = '/pages/feed.html';
            return;
        }

        try {
            // Backend se user data fetch karo (Jo aapne pehle controller banaya tha)
            const response = await fetch(`${CONFIG.API_URL}/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();

            if (result.success) {
                const user = result.data.user;
                // UI Update karo
                document.getElementById('p-username').textContent = `@${user.username}`;
                document.getElementById('p-email').textContent = user.email;
                document.getElementById('p-avatar').textContent = user.username.charAt(0).toUpperCase();
                document.getElementById('v-count').textContent = result.data.videoCount || 0;
                if(user.bio) document.getElementById('p-bio').textContent = user.bio;
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    initProfile();
}