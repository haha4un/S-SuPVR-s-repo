// Функции управления пользователями
function renderUsersList(users) {
    const usersListContent = document.getElementById('usersListContent');
    if (!usersListContent) return;
    
    usersListContent.innerHTML = '';
    
    users.forEach(user => {
        const userListItem = document.createElement('div');
        userListItem.className = 'user-list-item';
        
        if (appData.currentUser && user.id === appData.currentUser.id) {
            userListItem.classList.add('current-user');
        }
        
        const initials = user.name.split(' ').map(n => n[0]).join('');
        const typeClass = `user-type-${user.type}`;
        
        userListItem.innerHTML = `
            ${user.avatar ? 
                `<img src="${user.avatar}" alt="${user.name}" class="avatar">` :
                `<div class="avatar-placeholder">${initials}</div>`
            }
            <div class="user-list-info">
                <div class="user-list-name">
                    ${user.name}
                    <span class="user-type-badge ${typeClass}">${getUserTypeName(user.type)}</span>
                </div>
                <div class="user-list-details">
                    ${user.position || 'Должность не указана'}
                </div>
            </div>
        `;
        
        userListItem.addEventListener('click', () => {
            openUserProfileModal(user.id);
        });
        
        usersListContent.appendChild(userListItem);
    });
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderUsersList(appData.users);
        return;
    }
    
    const normalizedSearchTerm = searchTerm.replace(/[^\d]/g, '');
    
    const filteredUsers = appData.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.position && user.position.toLowerCase().includes(searchTerm)) ||
        getUserTypeName(user.type).toLowerCase().includes(searchTerm) ||
        (user.phone && (
            user.phone.toLowerCase().includes(searchTerm) ||
            user.phone.replace(/[^\d]/g, '').includes(normalizedSearchTerm)
        ))
    );
    
    renderUsersList(filteredUsers);
}

function openUserProfileModal(userId) {
    const user = appData.users.find(u => u.id === userId);
    if (!user) return;
    
    const modal = document.getElementById('userProfileModal');
    const title = document.getElementById('userProfileModalTitle');
    const content = document.getElementById('userProfileModalContent');
    
    if (!modal || !title || !content) return;
    
    title.textContent = `Профиль: ${user.name}`;
    
    const initials = user.name.split(' ').map(n => n[0]).join('');
    
    content.innerHTML = `
        <div class="avatar-upload">
            ${user.avatar ? 
                `<img src="${user.avatar}" alt="${user.name}" class="avatar-large">` :
                `<div class="avatar-preview-placeholder">${initials}</div>`
            }
        </div>
        
        <div class="form-group">
            <label>Имя:</label>
            <p style="padding: 10px; background: #f5f5f5; border-radius: 5px;">${user.name}</p>
        </div>
        
        <div class="form-group">
            <label>Email:</label>
            <p style="padding: 10px; background: #f5f5f5; border-radius: 5px;">${user.email}</p>
        </div>
        
        <div class="form-group">
            <label>Тип пользователя:</label>
            <p style="padding: 10px; background: #f5f5f5; border-radius: 5px;">${getUserTypeName(user.type)}</p>
        </div>
        
        <div class="form-group">
            <label>Должность:</label>
            <p style="padding: 10px; background: #f5f5f5; border-radius: 5px;">${user.position || 'Не указана'}</p>
        </div>
        
        ${user.phone ? `
        <div class="form-group">
            <label>Телефон:</label>
            <p style="padding: 10px; background: #f5f5f5; border-radius: 5px;">${user.phone}</p>
        </div>
        ` : ''}
    `;
    
    modal.style.display = 'flex';
}

function closeUserProfileModal() {
    document.getElementById('userProfileModal').style.display = 'none';
}

// Инициализация обработчиков для пользователей
document.addEventListener('DOMContentLoaded', function() {
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', filterUsers);
    }
    
    const closeUserProfileModalBtn = document.getElementById('closeUserProfileModal');
    if (closeUserProfileModalBtn) {
        closeUserProfileModalBtn.addEventListener('click', closeUserProfileModal);
    }
    
    // Закрытие модального окна профиля по клику вне
    const userProfileModal = document.getElementById('userProfileModal');
    if (userProfileModal) {
        userProfileModal.addEventListener('click', function(e) {
            if (e.target === userProfileModal) {
                closeUserProfileModal();
            }
        });
    }
});