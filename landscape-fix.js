/**
 * landscape-fix.js v2
 * Подключить в <body> КАЖДОЙ страницы после script.js:
 * <script src="landscape-fix.js"></script>
 * 
 * На страницах где нет script.js — добавить прямо перед </body>
 */
(function() {
    function showQRButton() {
        var btn = document.getElementById('qrFloatingButton');
        if (!btn) return;
        // Сбрасываем ВСЕ возможные способы скрытия
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
        btn.style.transform = 'scale(1)';
        btn.style.display = 'flex';
    }

    function isLandscape() {
        return window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
    }

    // Запускаем после полной загрузки страницы и всех скриптов
    window.addEventListener('load', function() {
        // Ждём дольше чем любой setTimeout на странице (там max 600ms)
        setTimeout(function() {
            if (isLandscape()) showQRButton();
        }, 1200);
    });

    // При повороте телефона
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            if (isLandscape()) showQRButton();
        }, 500);
    });
})();
