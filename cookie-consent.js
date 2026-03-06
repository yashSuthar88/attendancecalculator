document.addEventListener('DOMContentLoaded', () => {
    // Check if the user has already consented
    if (!localStorage.getItem('cookieConsent')) {
        const bannerContainer = document.createElement('div');
        bannerContainer.id = 'cookie-banner-container';
        bannerContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            justify-content: center;
            pointer-events: none;
        `;

        bannerContainer.innerHTML = `
            <div id="cookie-banner-inner" style="
                background: rgba(15, 15, 25, 0.95);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 16px 24px;
                display: flex;
                align-items: center;
                gap: 20px;
                flex-wrap: wrap;
                max-width: 800px;
                width: 100%;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                pointer-events: auto;
                animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            ">
                <span style="flex: 1; min-width: 250px; font-size: 0.9rem; line-height: 1.5; color: #f1f5f9;">
                    🍪 We use cookies and third-party tools (like AdSense) to deliver personalized ads and analyze traffic. By using our tools, you agree to our <a href="privacy.html" style="color: #06b6d4; text-decoration: underline;">Privacy Policy</a>.
                </span>
                <button id="accept-cookies" style="
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    color: white;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    transition: transform 0.2s;
                ">Got it!</button>
            </div>
            <style>
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                #accept-cookies:hover { transform: translateY(-2px); }
                #accept-cookies:active { transform: translateY(0); }
            </style>
        `;
        document.body.appendChild(bannerContainer);

        const btn = document.getElementById('accept-cookies');
        btn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            bannerContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            bannerContainer.style.opacity = '0';
            bannerContainer.style.transform = 'translateY(20px)';
            setTimeout(() => bannerContainer.remove(), 400);
        });
    }
});
