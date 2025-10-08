// Функции управления каталогами
function loadCatalogs() {
    const catalogGrid = document.getElementById('catalogGrid');
    if (!catalogGrid) return;
    
    catalogGrid.innerHTML = '';
    
    const sortedCatalogs = getSortedCatalogsForUser();
    
    sortedCatalogs.forEach(catalog => {
        const catalogElement = document.createElement('div');
        catalogElement.className = 'catalog-item';
        catalogElement.setAttribute('data-catalog-id', catalog.id);
        catalogElement.innerHTML = `
            <h3>${catalog.name}</h3>
            <p>${catalog.description}</p>
        `;
        
        catalogElement.addEventListener('click', () => {
            openCatalog(catalog.id);
        });
        
        catalogGrid.appendChild(catalogElement);
    });
}

function getSortedCatalogsForUser() {
    if (!appData.currentUser || !appData.currentUser.catalogOrder || appData.currentUser.catalogOrder.length === 0) {
        return [...appData.catalogs];
    }
    
    const userOrder = appData.currentUser.catalogOrder;
    const catalogsMap = new Map(appData.catalogs.map(c => [c.id, c]));
    
    const sortedCatalogs = userOrder
        .map(id => catalogsMap.get(id))
        .filter(catalog => catalog !== undefined);
    
    const remainingCatalogs = appData.catalogs.filter(catalog => !userOrder.includes(catalog.id));
    
    return [...sortedCatalogs, ...remainingCatalogs];
}

function openCatalog(catalogId) {
    const catalog = appData.catalogs.find(c => c.id === catalogId);
    if (!catalog) return;
    
    appData.currentCatalog = catalog;
    
    // Здесь должна быть логика открытия страницы каталога
    // Временно просто показываем alert
    alert(`Открыт каталог: ${catalog.name}`);
}

function createBottomNavigation() {
    const bottomNav = document.getElementById('bottomNav');
    if (!bottomNav) return;
    
    bottomNav.innerHTML = '';
    
    const navButtons = [
        { id: 'catalogs', icon: '📁', label: 'Каталоги' },
        { id: 'users', icon: '👥', label: 'Пользователи' },
        { id: 'events', icon: '📅', label: 'Мероприятия' }
    ];
    
    if (appData.currentUser && appData.currentUser.type === 'moderator') {
        navButtons.push({ id: 'moderator', icon: '⚙️', label: 'Модератор' });
    }
    
    navButtons.forEach((button, index) => {
        const navBtn = document.createElement('button');
        navBtn.className = `nav-btn ${index === 0 ? 'active' : ''}`;
        navBtn.setAttribute('data-tab', button.id);
        navBtn.innerHTML = `
            <div class="nav-icon">${button.icon}</div>
            <div class="nav-label">${button.label}</div>
        `;
        
        navBtn.addEventListener('click', () => {
            switchMainTab(button.id);
        });
        
        bottomNav.appendChild(navBtn);
    });
}

function switchMainTab(tabId) {
    // Сброс активных вкладок
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Активация выбранной вкладки
    const tabElement = document.getElementById(`${tabId}Tab`);
    const navBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    
    if (tabElement) tabElement.classList.add('active');
    if (navBtn) navBtn.classList.add('active');
    
    // Если переключились на мероприятия, обновляем список
    if (tabId === 'events' && typeof eventsManager !== 'undefined') {
        eventsManager.loadEventsForCurrentDate();
    }
}