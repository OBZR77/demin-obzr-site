/**
 * landscape-fix.js — показывает QR-кнопку в landscape-ориентации
 * Подключить в <body> каждой страницы ПОСЛЕ script.js:
 * <script src="landscape-fix.js"></script>
 */
(function() {
    function fixLandscapeQR() {
        var isLandscape = window.innerHeight <= 500 && 
                          window.screen.orientation 
                          ? window.screen.orientation.type.includes('landscape')
                          : window.innerWidth > window.innerHeight;
        
        if (!isLandscape) return;
        
        var qrBtn = document.getElementById('qrFloatingButton');
        if (!qrBtn) return;

        // Показываем кнопку через небольшую задержку (после JS страницы)
        setTimeout(function() {
            qrBtn.style.opacity = '1';
            qrBtn.style.visibility = 'visible';
            qrBtn.style.transform = 'scale(1)';
        }, 800);
    }

    // При загрузке страницы
    window.addEventListener('load', function() {
        setTimeout(fixLandscapeQR, 900);
    });

    // При повороте экрана
    window.addEventListener('orientationchange', function() {
        setTimeout(fixLandscapeQR, 400);
    });

    window.addEventListener('resize', function() {
        setTimeout(fixLandscapeQR, 300);
    });
})();
