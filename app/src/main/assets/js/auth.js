// Функции аутентификации и управления пользователями
function handleLogin() {
    console.log('Попытка входа...');
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (!emailInput || !passwordInput) {
        console.error('Поля ввода не найдены');
        alert('Ошибка: поля ввода не найдены');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    console.log('Введенные данные:', { email, password: '***' });
    
    // Проверка заполнения полей
    if (!email || !password) {
        alert('Заполните все поля!');
        return;
    }
    
    // Поиск пользователя
    const user = appData.users.find(u => 
        u.email === email && u.password === password
    );
    
    if (user) {
        console.log('Пользователь найден:', user.name);
        appData.currentUser = user;
        updateUserInterface();
        
        // Переключение интерфейсов
        const loginForm = document.getElementById('loginForm');
        const mainInterface = document.getElementById('mainInterface');
        
        if (loginForm && mainInterface) {
            loginForm.style.display = 'none';
            mainInterface.style.display = 'block';
        } else {
            console.error('Элементы интерфейса не найдены');
        }
        
        // Инициализация компонентов
        initializeUserInterface();
        
    } else {
        console.log('Пользователь не найден');
        alert('Неверные учетные данные! Проверьте email и пароль.');
    }
}

function initializeUserInterface() {
    console.log('Инициализация пользовательского интерфейса...');
    
    try {
        createBottomNavigation();
        loadCatalogs();
        renderUsersList(appData.users);
        setupUserInterface();
        
        // Инициализация менеджера мероприятий
        if (typeof eventsManager !== 'undefined') {
            eventsManager.init();
        }
        
        // Загрузка мероприятий для модератора
        if (typeof loadEventsForModeration === 'function') {
            loadEventsForModeration();
        }
        
        console.log('Пользовательский интерфейс инициализирован');
    } catch (error) {
        console.error('Ошибка при инициализации интерфейса:', error);
    }
}

function handleLogout() {
    console.log('Выход из системы...');
    appData.currentUser = null;
    appData.viewingUser = null;
    appData.currentCatalog = null;
    showLoginForm();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
}

function updateUserInterface() {
    const user = appData.currentUser;
    
    if (!user) return;
    
    console.log('Обновление интерфейса для пользователя:', user.name);
    
    // Обновление основного интерфейса
    const userNameElement = document.getElementById('userName');
    const headerAvatar = document.getElementById('headerAvatar');
    const headerAvatarPlaceholder = document.getElementById('headerAvatarPlaceholder');
    
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
    
    if (headerAvatar && headerAvatarPlaceholder) {
        updateHeaderAvatar(user, headerAvatar, headerAvatarPlaceholder);
    }
}

function setupUserInterface() {
    console.log('Настройка интерфейса по типу пользователя...');
    
    const moderatorPanel = document.getElementById('moderatorPanel');
    
    if (moderatorPanel) {
        if (appData.currentUser && appData.currentUser.type === 'moderator') {
            moderatorPanel.style.display = 'block';
            console.log('Панель модератора включена');
        } else {
            moderatorPanel.style.display = 'none';
            console.log('Панель модератора скрыта');
        }
    }
}

function showLoginForm() {
    console.log('Показ формы входа...');
    
    const loginForm = document.getElementById('loginForm');
    const mainInterface = document.getElementById('mainInterface');
    
    if (loginForm) loginForm.style.display = 'block';
    if (mainInterface) mainInterface.style.display = 'none';
}

function showMainInterface() {
    console.log('Показ главного интерфейса...');
    
    const loginForm = document.getElementById('loginForm');
    const mainInterface = document.getElementById('mainInterface');
    
    if (loginForm) loginForm.style.display = 'none';
    if (mainInterface) mainInterface.style.display = 'block';
    
    appData.viewingUser = null;
    appData.currentCatalog = null;
}