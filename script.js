// ============================================
// УНИВЕРСАЛЬНЫЙ JAVASCRIPT ДЛЯ САЙТА ОБЗР
// Файл: script.js
// Автор: Дёмин А.Ю.
// ============================================

// ============================================
// ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ МОБИЛЬНОГО МЕНЮ
// ============================================
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// ============================================
// АВТОМАТИЧЕСКОЕ ВЫДЕЛЕНИЕ АКТИВНОГО ПУНКТА МЕНЮ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // СНАЧАЛА УДАЛЯЕМ ВСЕ СУЩЕСТВУЮЩИЕ class="active"
    document.querySelectorAll('.nav-menu a.active').forEach(link => {
        link.classList.remove('active');
    });
    
    // Получаем текущую страницу из URL
    let currentPage = window.location.pathname.split('/').pop();
    
    // Если страница не указана (корень сайта), считаем что это index.html
    if (currentPage === '' || currentPage === '/') {
        currentPage = 'index.html';
    }
    
    // ===== СПЕЦИАЛЬНАЯ ЛОГИКА ДЛЯ ПОДСТРАНИЦ "ИИ в образовании" =====
    const aiPages = [
        'ai-dlya-uchenikov.html',
        'ai-dlya-roditelej.html', 
        'ai-dlya-kolleg.html',
        'ai-poleznye-resursy.html'
    ];
    
    // Если текущая страница — подстраница "ИИ в образовании"
    if (aiPages.includes(currentPage)) {
        const aiLink = document.querySelector('a[href="ai-projects.html"]');
        if (aiLink) {
            aiLink.classList.add('active');
            return; // Прекращаем дальнейший поиск
        }
    }
    // Находим все ссылки в меню
    const menuLinks = document.querySelectorAll('.nav-menu a');
    
    // Проходимся по каждой ссылке
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return; // Пропускаем, если нет href
        
        // Получаем имя страницы из href (без якорей)
        const linkPage = href.split('#')[0].split('?')[0];
        
        // Проверяем совпадение текущей страницы со ссылкой
        if (linkPage === currentPage || 
            (currentPage === 'index.html' && (linkPage === '' || linkPage === '/' || linkPage === 'index.html'))) {
            
            // Добавляем класс active к текущей ссылке
            link.classList.add('active');
            
            // Если это подпункт меню, выделяем также родительский пункт
            const parentLi = link.closest('li').parentElement.closest('li');
            if (parentLi && parentLi.classList.contains('has-submenu')) {
                const parentLink = parentLi.querySelector('a');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });
});

// ============================================
// ОБРАБОТКА ПОДМЕНЮ НА МОБИЛЬНЫХ УСТРОЙСТВАХ
// ============================================

function handleSubmenuClick(event, element) {
    // Проверяем, мобильное ли устройство
    if (window.innerWidth <= 768) {
        const parentLi = element.parentElement;
        
        // Если подменю УЖЕ открыто — разрешаем переход
        if (parentLi.classList.contains('open')) {
            return true; // Переходим по ссылке
        }
        
        // Если подменю закрыто — открываем его
        event.preventDefault();
        
        // Закрываем другие открытые подменю
        document.querySelectorAll('.has-submenu.open').forEach(item => {
            if (item !== parentLi) {
                item.classList.remove('open');
            }
        });
        
        // Переключаем состояние текущего подменю
        parentLi.classList.toggle('open');
        
        return false; // НЕ переходим по ссылке
    }
    return true; // На десктопе разрешаем переход
}
// Закрытие подменю при клике вне его (только для мобильных)
document.addEventListener('click', function(event) {
    if (!event.target.closest('.has-submenu') && window.innerWidth <= 768) {
        document.querySelectorAll('.has-submenu.open').forEach(item => {
            item.classList.remove('open');
        });
    }
});

// ============================================
// ПЛАВАЮЩАЯ КНОПКА С QR-КОДОМ
// ============================================

// Проверяем наличие элементов (на некоторых страницах QR-кнопки может не быть)
const qrFloatingButton = document.getElementById('qrFloatingButton');
const qrModalWindow = document.getElementById('qrModalWindow');
const qrButtonHint = document.getElementById('qrButtonHint');

// Если QR-кнопка существует на странице, инициализируем её функционал
if (qrFloatingButton && qrModalWindow) {
     // СКРЫВАЕМ КНОПКУ СРАЗУ ПРИ ЗАГРУЗКЕ DOM
    document.addEventListener('DOMContentLoaded', function() {
        qrFloatingButton.style.opacity = '0';
        qrFloatingButton.style.visibility = 'hidden';
    });
    // Переменные для отслеживания перетаскивания
    let isDragging = false;
    let startX, startY;
    let currentX, currentY;
    let offsetX = 0, offsetY = 0;
    let dragStartTime = 0;
    let hasMoved = false;
    
    // Загрузка сохранённой позиции кнопки из localStorage
    function loadButtonPosition() {
        const savedPos = localStorage.getItem('qrButtonPosition');
        if (savedPos) {
            const pos = JSON.parse(savedPos);
            qrFloatingButton.style.left = pos.x + 'px';
            qrFloatingButton.style.top = pos.y + 'px';
            qrFloatingButton.style.right = 'auto';
            qrFloatingButton.style.bottom = 'auto';
        }
    }
    
    // Сохранение позиции кнопки в localStorage
    function saveButtonPosition(x, y) {
        localStorage.setItem('qrButtonPosition', JSON.stringify({ x, y }));
    }
    
    // Начало перетаскивания (мышь)
    qrFloatingButton.addEventListener('mousedown', function(e) {
        startDragging(e.clientX, e.clientY);
    });
    
    // Начало перетаскивания (тач)
    qrFloatingButton.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        startDragging(touch.clientX, touch.clientY);
    }, { passive: true });
    
    function startDragging(clientX, clientY) {
        dragStartTime = Date.now();
        hasMoved = false;
        isDragging = true;
        
        const rect = qrFloatingButton.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        
        qrFloatingButton.classList.add('dragging');
        
        // Скрываем подсказку при перетаскивании
        if (qrButtonHint) {
            qrButtonHint.style.display = 'none';
        }
    }
    
    // Перемещение кнопки (мышь)
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            e.preventDefault();
            moveButton(e.clientX, e.clientY);
        }
    });
    
    // Перемещение кнопки (тач)
    document.addEventListener('touchmove', function(e) {
        if (isDragging) {
            const touch = e.touches[0];
            moveButton(touch.clientX, touch.clientY);
        }
    }, { passive: false });
    
    function moveButton(clientX, clientY) {
        hasMoved = true;
        
        currentX = clientX - offsetX;
        currentY = clientY - offsetY;
        
        // Ограничиваем позицию в пределах экрана
        const maxX = window.innerWidth - qrFloatingButton.offsetWidth;
        const maxY = window.innerHeight - qrFloatingButton.offsetHeight;
        
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));
        
        qrFloatingButton.style.left = currentX + 'px';
        qrFloatingButton.style.top = currentY + 'px';
        qrFloatingButton.style.right = 'auto';
        qrFloatingButton.style.bottom = 'auto';
    }
    
    // Конец перетаскивания (мышь)
    document.addEventListener('mouseup', function() {
        endDragging();
    });
    
    // Конец перетаскивания (тач)
    document.addEventListener('touchend', function() {
        endDragging();
    });
    
    function endDragging() {
        if (isDragging) {
            qrFloatingButton.classList.remove('dragging');
            
            const dragDuration = Date.now() - dragStartTime;
            
            // Если кнопку НЕ двигали или двигали меньше 200мс — это клик
            if (!hasMoved || dragDuration < 200) {
                openQRModal();
            } else {
                // Сохраняем позицию
                saveButtonPosition(currentX, currentY);
            }
            
            isDragging = false;
        }
    }
    
    // Открытие модального окна с QR-кодом
    function openQRModal() {
        qrModalWindow.style.display = 'flex';
        document.body.classList.add('modal-open');
        qrModalWindow.scrollTop = 0;
    }
    
    // Закрытие модального окна (глобальная функция)
    window.closeQRModal = function() {
        qrModalWindow.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    
    // Закрытие при клике вне окна
    qrModalWindow.addEventListener('click', function(event) {
        if (event.target === qrModalWindow) {
            closeQRModal();
        }
    });
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && qrModalWindow.style.display === 'flex') {
            closeQRModal();
        }
    });
    
    // Показ подсказки при первом посещении
    function showHintIfNeeded() {
        if (!qrButtonHint) return;
        
        const hintShown = localStorage.getItem('qrButtonHintShown');
        if (!hintShown) {
            setTimeout(() => {
                qrButtonHint.style.display = 'block';
                
                // Скрываем через 5 секунд
                setTimeout(() => {
                    qrButtonHint.style.opacity = '0';
                    qrButtonHint.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        qrButtonHint.style.display = 'none';
                    }, 500);
                }, 5000);
                
                localStorage.setItem('qrButtonHintShown', 'true');
            }, 2000);
        }
    }
    
    // Инициализация при загрузке страницы
window.addEventListener('load', function() {
    // Загружаем сохранённую позицию
    loadButtonPosition();
    
    // Показываем подсказку
    showHintIfNeeded();
    
    // Плавное появление кнопки ПОСЛЕ установки позиции
    setTimeout(function() {
        if (qrFloatingButton) {
            qrFloatingButton.style.visibility = 'visible';
            qrFloatingButton.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            qrFloatingButton.style.opacity = '1';
            qrFloatingButton.style.transform = 'scale(1)';
        }
    }, 100);
});
    
    // Предотвращаем случайное перетаскивание при быстром клике
    qrFloatingButton.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// ============================================
// ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Пропускаем пустые якори
        if (href === '#' || href.length <= 1) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Обновляем URL без перезагрузки страницы
            history.pushState(null, null, href);
        }
    });
});

// ============================================
// ОТЛАДОЧНАЯ ИНФОРМАЦИЯ (можно удалить в production)
// ============================================
console.log('✅ Скрипт сайта ОБЗР загружен успешно');

console.log('📄 Текущая страница:', window.location.pathname.split('/').pop() || 'index.html');



