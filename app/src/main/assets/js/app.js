let eventsManager;

function initApp() {
    console.log('Инициализация приложения...');
    
    // Проверяем существование необходимых элементов
    const requiredElements = [
        'loginBtn', 'logoutBtn', 'loginForm', 'mainInterface'
    ];
    
    for (const elementId of requiredElements) {
        if (!document.getElementById(elementId)) {
            console.error(`Элемент с ID '${elementId}' не найден`);
        }
    }
    
    // Инициализируем менеджер мероприятий только если он нужен
    if (typeof EventsManager !== 'undefined') {
        eventsManager = new EventsManager();
    }
    
    showLoginForm();
    setupEventListeners();
    setupLoginEnterKey();
    
    console.log('Приложение инициализировано');
}

function setupEventListeners() {
    console.log('Настройка обработчиков событий...');
    
    // Основные обработчики событий
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
        console.log('Обработчик входа установлен');
    } else {
        console.error('Кнопка входа не найдена');
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('Обработчик выхода установлен');
    }
    
    // Обработчики модальных окон (добавляем только если элементы существуют)
    setupModalCloseListeners();
    
    console.log('Обработчики событий настроены');
}

function setupModalCloseListeners() {
    const modals = [
        { id: 'eventModal', closeFunc: () => document.getElementById('eventModal').style.display = 'none' },
        { id: 'eventFormModal', closeFunc: () => eventsManager?.closeEventFormModal() },
        { id: 'calendarModal', closeFunc: () => eventsManager?.closeCalendarModal() },
        { id: 'userProfileModal', closeFunc: () => closeUserProfileModal() },
        { id: 'settingsModal', closeFunc: () => document.getElementById('settingsModal').style.display = 'none' },
        { id: 'addCatalogModal', closeFunc: () => document.getElementById('addCatalogModal').style.display = 'none' }
    ];
    
    modals.forEach(({ id, closeFunc }) => {
        const modal = document.getElementById(id);
        const closeBtn = document.getElementById(`close${id.charAt(0).toUpperCase() + id.slice(1)}`);
        
        if (modal && closeBtn) {
            closeBtn.addEventListener('click', closeFunc);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeFunc();
                }
            });
        }
    });
}

function setupLoginEnterKey() {
    const passwordField = document.getElementById('password');
    const emailField = document.getElementById('email');
    
    if (passwordField) {
        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
    
    if (emailField) {
        emailField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, запуск приложения...');
    initApp();
});