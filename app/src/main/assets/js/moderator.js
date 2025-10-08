// Функции панели модератора
function initModeratorPanel() {
    setupPanelTabs();
    setupCatalogManagement();
    setupUserManagement();
    setupEventManagement();
}

function setupPanelTabs() {
    const panelTabs = document.querySelectorAll('.panel-tab');
    panelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const panelId = tab.getAttribute('data-panel');
            switchPanelTab(panelId);
        });
    });
}

function switchPanelTab(panelId) {
    // Сброс активных вкладок
    document.querySelectorAll('.panel-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.panel-content').forEach(content => content.classList.remove('active'));
    
    // Активация выбранной вкладки
    const activeTab = document.querySelector(`.panel-tab[data-panel="${panelId}"]`);
    const activePanel = document.getElementById(`${panelId}Panel`);
    
    if (activeTab) activeTab.classList.add('active');
    if (activePanel) activePanel.classList.add('active');
    
    // Загрузка данных при переключении
    if (panelId === 'events') {
        loadEventsForModeration();
    } else if (panelId === 'users') {
        loadUsersForModeration();
    } else if (panelId === 'catalogs') {
        loadCatalogsForModeration();
    }
}

function setupCatalogManagement() {
    const openAddCatalogModal = document.getElementById('openAddCatalogModal');
    const addCatalogBtn = document.getElementById('addCatalogBtn');
    const closeAddCatalogModal = document.getElementById('closeAddCatalogModal');
    
    if (openAddCatalogModal) {
        openAddCatalogModal.addEventListener('click', openAddCatalogModalFunc);
    }
    
    if (addCatalogBtn) {
        addCatalogBtn.addEventListener('click', addCatalog);
    }
    
    if (closeAddCatalogModal) {
        closeAddCatalogModal.addEventListener('click', closeAddCatalogModalFunc);
    }
}

function openAddCatalogModalFunc() {
    document.getElementById('addCatalogModal').style.display = 'flex';
}

function closeAddCatalogModalFunc() {
    document.getElementById('addCatalogModal').style.display = 'none';
}

function addCatalog() {
    const name = document.getElementById('catalogName').value;
    const description = document.getElementById('catalogDescription').value;
    
    if (!name || !description) {
        alert('Заполните все поля!');
        return;
    }
    
    const newCatalog = {
        id: appData.catalogs.length > 0 ? Math.max(...appData.catalogs.map(c => c.id)) + 1 : 1,
        name,
        description,
        files: [],
        links: []
    };
    
    appData.catalogs.push(newCatalog);
    alert('Каталог успешно добавлен!');
    closeAddCatalogModalFunc();
    loadCatalogsForModeration();
    loadCatalogs(); // Обновляем основной список каталогов
}

function loadCatalogsForModeration() {
    const catalogList = document.getElementById('catalogList');
    if (!catalogList) return;
    
    catalogList.innerHTML = '<h3>Список каталогов</h3>';
    
    if (appData.catalogs.length === 0) {
        catalogList.innerHTML += '<p>Нет созданных каталогов</p>';
        return;
    }
    
    appData.catalogs.forEach(catalog => {
        const catalogElement = document.createElement('div');
        catalogElement.className = 'catalog-item-admin';
        catalogElement.innerHTML = `
            <div>
                <strong>${catalog.name}</strong>
                <p>${catalog.description}</p>
                <p style="font-size: 12px; color: #666;">Файлов: ${catalog.files.length}, Ссылок: ${catalog.links.length}</p>
            </div>
            <div class="catalog-actions">
                <button class="btn btn-small btn-warning" onclick="editCatalog(${catalog.id})">Редактировать</button>
                <button class="btn btn-small btn-danger" onclick="deleteCatalog(${catalog.id})">Удалить</button>
            </div>
        `;
        catalogList.appendChild(catalogElement);
    });
}

function setupUserManagement() {
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', addUser);
    }
}

function addUser() {
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const type = document.getElementById('newUserType').value;
    const position = document.getElementById('newUserPosition').value;
    const phone = document.getElementById('newUserPhone').value;
    
    if (!name || !email || !password || !type) {
        alert('Заполните обязательные поля!');
        return;
    }
    
    // Проверка уникальности email
    if (appData.users.some(user => user.email === email)) {
        alert('Пользователь с таким email уже существует!');
        return;
    }
    
    const newUser = {
        id: appData.users.length > 0 ? Math.max(...appData.users.map(u => u.id)) + 1 : 1,
        name,
        email,
        password,
        type,
        position: position || '',
        phone: phone || '',
        avatar: '',
        catalogOrder: []
    };
    
    appData.users.push(newUser);
    alert('Пользователь успешно добавлен!');
    
    // Очистка формы
    document.getElementById('newUserName').value = '';
    document.getElementById('newUserEmail').value = '';
    document.getElementById('newUserPassword').value = '';
    document.getElementById('newUserPosition').value = '';
    document.getElementById('newUserPhone').value = '';
    
    loadUsersForModeration();
    renderUsersList(appData.users); // Обновляем основной список пользователей
}

function loadUsersForModeration() {
    const userList = document.getElementById('userList');
    if (!userList) return;
    
    userList.innerHTML = '<h3 style="margin-top: 30px;">Список пользователей</h3>';
    
    if (appData.users.length === 0) {
        userList.innerHTML += '<p>Нет зарегистрированных пользователей</p>';
        return;
    }
    
    appData.users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.innerHTML = `
            <div>
                <strong>${user.name}</strong>
                <p>${user.email} | ${getUserTypeName(user.type)}</p>
                <p style="font-size: 12px; color: #666;">${user.position || 'Должность не указана'}</p>
            </div>
            <div class="user-actions">
                <button class="btn btn-small" onclick="editUser(${user.id})">Редактировать</button>
                <button class="btn btn-small btn-danger" onclick="deleteUser(${user.id})">Удалить</button>
            </div>
        `;
        userList.appendChild(userElement);
    });
}

function setupEventManagement() {
    const openAddEventModal = document.getElementById('openAddEventModal');
    if (openAddEventModal) {
        openAddEventModal.addEventListener('click', openAddEventModal);
    }
}

// В функции loadEventsForModeration добавьте кнопки редактирования
function loadEventsForModeration() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;
    
    eventsList.innerHTML = '<h3>Список мероприятий</h3>';
    
    if (appData.events.length === 0) {
        eventsList.innerHTML += '<p>Нет запланированных мероприятий</p>';
        return;
    }
    
    const sortedEvents = [...appData.events].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        return dateCompare !== 0 ? dateCompare : a.startTime.localeCompare(b.startTime);
    });
    
    sortedEvents.forEach(event => {
        const participantsNames = getParticipantsNames(event.participants);
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.innerHTML = `
            <div>
                <strong>${event.title}</strong>
                <p>${formatDate(event.date)} | ${event.startTime} - ${event.endTime}</p>
                <p>${event.location}</p>
                <p style="font-size: 12px; color: #666;">${event.description}</p>
                <p style="font-size: 11px; color: #888;">Участники: ${participantsNames}</p>
            </div>
            <div class="event-actions">
                <button class="btn btn-small" onclick="openEditEventModal(${event.id})">Редактировать</button>
                <button class="btn btn-small btn-danger" onclick="deleteEvent(${event.id})">Удалить</button>
            </div>
        `;
        eventsList.appendChild(eventElement);
    });
}

// Вспомогательная функция для получения имен участников
function getParticipantsNames(participantIds) {
    if (!participantIds || participantIds.length === 0) return 'Не указаны';
    return participantIds.map(id => {
        const user = appData.users.find(u => u.id === id);
        return user ? user.name : 'Неизвестный';
    }).join(', ');
}

// Вспомогательные функции (заглушки)
function editCatalog(id) {
    alert(`Редактирование каталога ${id} - функция в разработке`);
}

function deleteCatalog(id) {
    if (confirm('Вы уверены, что хотите удалить этот каталог?')) {
        appData.catalogs = appData.catalogs.filter(c => c.id !== id);
        loadCatalogsForModeration();
        loadCatalogs();
        alert('Каталог успешно удален!');
    }
}

function editUser(id) {
    alert(`Редактирование пользователя ${id} - функция в разработке`);
}

function deleteUser(id) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        appData.users = appData.users.filter(u => u.id !== id);
        loadUsersForModeration();
        renderUsersList(appData.users);
        alert('Пользователь успешно удален!');
    }
}

// Инициализация панели модератора при загрузке
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('moderatorPanel')) {
        initModeratorPanel();
    }
});