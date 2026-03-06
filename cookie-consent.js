document.addEventListener('DOMContentLoaded', () => {
    // Check if the user has already consented
    if (!localStorage.getItem('cookieConsent')) {
        const bannerContainer = document.createElement('div');
        bannerContainer.id = 'cookie-banner-container';
        bannerContainer.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            z-index: 10000;
            max-width: 360px;
            pointer-events: none;
        `;

        bannerContainer.innerHTML = `
            <div id="cookie-banner-inner" style="
                background: rgba(15, 15, 25, 0.85);
                backdrop-filter: blur(25px);
                -webkit-backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 28px;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 18px;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
                pointer-events: auto;
                animation: slideRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                opacity: 0;
            ">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="font-size: 1.8rem;">🍪</div>
                    <div style="font-weight: 800; color: #fff; font-size: 1.2rem; font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.5px;">Privacy Policy</div>
                </div>
                <p style="font-size: 0.9rem; line-height: 1.6; color: #94a3b8; margin: 0; font-weight: 500;">
                    We use cookies to personalize your experience and show relevant ads via Google AdSense. 
                    <a href="privacy.html" style="color: #06b6d4; text-decoration: none; font-weight: 700;">More Info</a>
                </p>
                <div style="display: flex; gap: 12px;">
                    <button id="accept-cookies" style="
                        flex: 1.5;
                        background: linear-gradient(135deg, #06b6d4, #3b82f6);
                        color: white;
                        border: none;
                        padding: 14px;
                        border-radius: 16px;
                        cursor: pointer;
                        font-weight: 800;
                        font-size: 0.95rem;
                        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
                    ">Accept All</button>
                    <button id="decline-cookies" style="
                        flex: 1;
                        background: rgba(255,255,255,0.06);
                        color: #94a3b8;
                        border: 1px solid rgba(255,255,255,0.1);
                        padding: 14px;
                        border-radius: 16px;
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 0.9rem;
                        transition: all 0.3s;
                    ">Dismiss</button>
                </div>
            </div>
            <style>
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-50px) scale(0.95); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                #accept-cookies:hover { 
                    transform: translateY(-4px) scale(1.02); 
                    box-shadow: 0 12px 25px rgba(6, 182, 212, 0.4);
                }
                #decline-cookies:hover {
                    background: rgba(255,255,255,0.12);
                    color: #fff;
                    border-color: rgba(255,255,255,0.2);
                }
            </style>
        `;
        document.body.appendChild(bannerContainer);

        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');

        const closeBanner = () => {
            bannerContainer.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            bannerContainer.style.opacity = '0';
            bannerContainer.style.transform = 'translateX(-50px) scale(0.95)';
            setTimeout(() => bannerContainer.remove(), 600);
        };

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            closeBanner();
        });

        declineBtn.addEventListener('click', closeBanner);
    }
});
