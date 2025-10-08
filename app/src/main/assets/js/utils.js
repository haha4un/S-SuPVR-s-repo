// Вспомогательные функции
function getUserTypeName(type) {
    switch(type) {
        case 'deputy': return 'Депутат';
        case 'assistant': return 'Помощник депутата';
        case 'moderator': return 'Модератор';
        default: return 'Неизвестно';
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getFileIcon(fileType) {
    switch(fileType) {
        case 'pdf': return '📄';
        case 'doc': case 'docx': return '📝';
        case 'xls': case 'xlsx': return '📊';
        case 'ppt': case 'pptx': return '📽️';
        case 'jpg': case 'jpeg': case 'png': return '🖼️';
        default: return '📎';
    }
}

function getFileTypeName(fileType) {
    switch(fileType) {
        case 'pdf': return 'PDF документ';
        case 'doc': case 'docx': return 'Word документ';
        case 'xls': case 'xlsx': return 'Excel таблица';
        case 'ppt': case 'pptx': return 'PowerPoint презентация';
        case 'jpg': case 'jpeg': case 'png': return 'Изображение';
        default: return 'Файл';
    }
}

function updateHeaderAvatar(user, avatarElement, placeholderElement) {
    if (user.avatar) {
        avatarElement.src = user.avatar;
        avatarElement.style.display = 'block';
        placeholderElement.style.display = 'none';
    } else {
        const initials = user.name.split(' ').map(n => n[0]).join('');
        avatarElement.src = '';
        avatarElement.style.display = 'none';
        placeholderElement.textContent = initials;
        placeholderElement.style.display = 'flex';
    }
}

// Функция для отладки
function debugAppState() {
    console.log('Текущее состояние приложения:', {
        currentUser: appData.currentUser,
        users: appData.users.length,
        catalogs: appData.catalogs.length,
        events: appData.events.length
    });
}