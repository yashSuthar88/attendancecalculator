document.addEventListener('DOMContentLoaded', () => {
    // Check if the user has already consented
    if (!localStorage.getItem('cookieConsent')) {
        const banner = document.createElement('div');
        banner.innerHTML = `
            <div style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(10, 10, 15, 0.95); backdrop-filter: blur(10px); color: var(--text, #fff); padding: 16px 24px; z-index: 9999; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; font-size: 0.9rem; box-shadow: 0 -10px 30px rgba(0,0,0,0.5);">
                <span style="flex: 1; min-width: 250px; line-height: 1.5; color: rgba(255,255,255,0.8);">
                    We use cookies and third-party tools (like Google AdSense) to serve personalized ads and analyze traffic. By continuing to use this site, you consent to our <a href="privacy.html" style="color: #a78bfa; text-decoration: underline;">Privacy Policy</a>.
                </span>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <button id="accept-cookies" style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; font-family: 'Space Grotesk', sans-serif; transition: opacity 0.2s;">Got it!</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Add hover effect
        const btn = document.getElementById('accept-cookies');
        btn.addEventListener('mouseover', () => btn.style.opacity = '0.9');
        btn.addEventListener('mouseout', () => btn.style.opacity = '1');

        // Handle acceptance
        btn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(20px)';
            setTimeout(() => banner.remove(), 400);
        });
    }
});
