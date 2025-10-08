class EventsManager {
    constructor() {
        console.log('EventsManager инициализирован');
        this.currentWeekStart = getWeekStartDate(new Date());
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('Настройка обработчиков мероприятий...');
        
        // Навигация по неделям
        const prevWeekBtn = document.getElementById('prevWeekBtn');
        const nextWeekBtn = document.getElementById('nextWeekBtn');
        const openCalendarModal = document.getElementById('openCalendarModal');
        const closeCalendarModal = document.getElementById('closeCalendarModal');
        const saveEventBtn = document.getElementById('saveEventBtn');
        const closeEventFormModal = document.getElementById('closeEventFormModal');
        const openAddEventModal = document.getElementById('openAddEventModal');
        
        if (prevWeekBtn) prevWeekBtn.addEventListener('click', () => this.goToPrevWeek());
        if (nextWeekBtn) nextWeekBtn.addEventListener('click', () => this.goToNextWeek());
        if (openCalendarModal) openCalendarModal.addEventListener('click', () => this.openCalendarModal());
        if (closeCalendarModal) closeCalendarModal.addEventListener('click', () => this.closeCalendarModal());
        if (saveEventBtn) saveEventBtn.addEventListener('click', () => this.saveEvent());
        if (closeEventFormModal) closeEventFormModal.addEventListener('click', () => this.closeEventFormModal());
        if (openAddEventModal) openAddEventModal.addEventListener('click', () => this.openEventFormModal());
    }

    init() {
        console.log('Инициализация менеджера мероприятий...');
        this.renderWeekDays();
        this.updateWeekTitle();
        this.loadEventsForCurrentDate();
    }

    loadEventsForCurrentDate() {
        const dateStr = appData.currentEventsDate.toISOString().split('T')[0];
        this.updateDateTitle();
        
        const eventsForDate = appData.events.filter(event => event.date === dateStr);
        
        const eventsListContent = document.getElementById('eventsListContent');
        if (!eventsListContent) return;
        
        if (eventsForDate.length === 0) {
            eventsListContent.innerHTML = `
                <div class="no-events">
                    <p>На этот день мероприятий не запланировано</p>
                </div>
            `;
            return;
        }
        
        eventsForDate.sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        let eventsHTML = '';
        eventsForDate.forEach(event => {
            eventsHTML += this.createEventCardHTML(event);
        });
        
        eventsListContent.innerHTML = eventsHTML;
        this.addEventCardListeners();
    }

    createEventCardHTML(event) {
        const participantsNames = this.getParticipantsNames(event.participants);
        return `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-time">
                    <div class="event-time-start">${event.startTime}</div>
                    <div class="event-time-end">${event.endTime}</div>
                </div>
                <div class="event-details">
                    <div class="event-title">${event.title}</div>
                    <div class="event-description">${event.description}</div>
                    <div class="event-participants">Участники: ${participantsNames}</div>
                    <div class="event-location">${event.location}</div>
                </div>
            </div>
        `;
    }

    getParticipantsNames(participantIds) {
        if (!participantIds || participantIds.length === 0) return 'Не указаны';
        return participantIds.map(id => {
            const user = appData.users.find(u => u.id === id);
            return user ? user.name : 'Неизвестный';
        }).join(', ');
    }

    renderWeekDays() {
        const weekDaysContainer = document.getElementById('weekDays');
        if (!weekDaysContainer) return;
        
        let weekDaysHTML = '';
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(this.currentWeekStart);
            currentDate.setDate(this.currentWeekStart.getDate() + i);
            
            const dateStr = currentDate.toISOString().split('T')[0];
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const isSelected = dateStr === appData.currentEventsDate.toISOString().split('T')[0];
            const hasEvents = appData.events.some(event => event.date === dateStr);
            
            let dayClass = 'week-day';
            if (isSelected) dayClass += ' active';
            if (isToday) dayClass += ' today';
            if (hasEvents) dayClass += ' has-events';
            
            const dayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
            const dayName = dayNames[currentDate.getDay()];
            const dayNumber = currentDate.getDate();
            
            weekDaysHTML += `
                <div class="${dayClass}" data-date="${dateStr}">
                    <div class="day-name">${dayName}</div>
                    <div class="day-number">${dayNumber}</div>
                </div>
            `;
        }
        
        weekDaysContainer.innerHTML = weekDaysHTML;
        this.addWeekDayListeners();
    }

    addWeekDayListeners() {
        document.querySelectorAll('.week-day').forEach(day => {
            day.addEventListener('click', () => {
                const dateStr = day.getAttribute('data-date');
                appData.currentEventsDate = new Date(dateStr);
                this.loadEventsForCurrentDate();
                this.renderWeekDays();
            });
        });
    }

    addEventCardListeners() {
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const eventId = parseInt(card.getAttribute('data-event-id'));
                this.openEventModal(eventId);
            });
        });
    }

    goToPrevWeek() {
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
        this.renderWeekDays();
        this.updateWeekTitle();
    }

    goToNextWeek() {
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
        this.renderWeekDays();
        this.updateWeekTitle();
    }

    updateWeekTitle() {
        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(this.currentWeekStart.getDate() + 6);
        
        const options = { day: 'numeric', month: 'long' };
        const startStr = this.currentWeekStart.toLocaleDateString('ru-RU', options);
        const endStr = weekEnd.toLocaleDateString('ru-RU', options);
        
        const weekTitle = document.getElementById('currentWeekTitle');
        if (weekTitle) {
            weekTitle.textContent = `${startStr} - ${endStr}`;
        }
    }

    updateDateTitle() {
        const today = new Date();
        const currentDate = appData.currentEventsDate;
        const dateStr = currentDate.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        
        let title = '';
        if (dateStr === todayStr) {
            title = 'Сегодня';
        } else {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            title = currentDate.toLocaleDateString('ru-RU', options);
        }
        
        const dateTitle = document.getElementById('currentDateTitle');
        if (dateTitle) {
            dateTitle.textContent = title;
        }
    }

    openEventFormModal(eventId = null) {
        appData.currentEventForEdit = eventId ? appData.events.find(e => e.id === eventId) : null;
        
        const modalTitle = document.getElementById('eventFormModalTitle');
        if (modalTitle) {
            modalTitle.textContent = appData.currentEventForEdit ? 'Редактирование мероприятия' : 'Добавление мероприятия';
        }
        
        this.renderEventForm();
        const modal = document.getElementById('eventFormModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    renderEventForm() {
        const event = appData.currentEventForEdit;
        const formContent = document.getElementById('eventFormContent');
        if (!formContent) return;
        
        const formHTML = `
            <div class="form-group">
                <label for="eventTitle">Название мероприятия:</label>
                <input type="text" id="eventTitle" placeholder="Введите название" value="${event ? event.title : ''}">
            </div>
            <div class="form-group">
                <label for="eventDescription">Описание:</label>
                <textarea id="eventDescription" placeholder="Введите описание мероприятия">${event ? event.description : ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="eventDate">Дата:</label>
                    <input type="date" id="eventDate" value="${event ? event.date : new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="eventStartTime">Время начала:</label>
                    <input type="time" id="eventStartTime" value="${event ? event.startTime : '09:00'}">
                </div>
                <div class="form-group">
                    <label for="eventEndTime">Время окончания:</label>
                    <input type="time" id="eventEndTime" value="${event ? event.endTime : '10:00'}">
                </div>
            </div>
            <div class="form-group">
                <label for="eventLocation">Место проведения:</label>
                <input type="text" id="eventLocation" placeholder="Введите место проведения" value="${event ? event.location : ''}">
            </div>
            <div class="form-group">
                <label for="participantsSearch">Поиск участников:</label>
                <input type="text" id="participantsSearch" placeholder="Начните вводить имя пользователя..." class="search-input">
            </div>
            <div class="form-group">
                <label>Участники мероприятия:</label>
                <div class="selected-participants" id="selectedParticipants">
                    ${this.renderSelectedParticipants(event ? event.participants : [])}
                </div>
            </div>
            <div class="form-group">
                <label>Список пользователей:</label>
                <div class="participants-selector" id="participantsSelector">
                    ${this.renderParticipantsSelector(event ? event.participants : [])}
                </div>
            </div>
            <div class="form-group">
                <label for="eventNotes">Примечания:</label>
                <textarea id="eventNotes" placeholder="Введите примечания">${event ? event.notes || '' : ''}</textarea>
            </div>
            <button class="btn btn-block" id="saveEventBtn">Сохранить мероприятие</button>
        `;
        
        formContent.innerHTML = formHTML;
        
        // Добавляем обработчики для поиска и выбора участников
        this.setupParticipantsSearch();
        this.setupParticipantsSelection();
        
        // Обновляем обработчик сохранения
        const saveBtn = document.getElementById('saveEventBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveEvent());
        }
    }

    renderSelectedParticipants(selectedParticipants = []) {
        if (selectedParticipants.length === 0) {
            return '<div class="no-participants">Участники не выбраны</div>';
        }
        
        let html = '<div class="selected-participants-list">';
        
        selectedParticipants.forEach(participantId => {
            const user = appData.users.find(u => u.id === participantId);
            if (user) {
                html += `
                    <div class="selected-participant" data-user-id="${user.id}">
                        <span class="participant-name">${user.name}</span>
                        <button type="button" class="remove-participant" data-user-id="${user.id}">×</button>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        return html;
    }

    renderParticipantsSelector(selectedParticipants = []) {
        let html = '<div class="participants-list" id="participantsList">';
        
        appData.users.forEach(user => {
            const isSelected = selectedParticipants.includes(user.id);
            const userType = getUserTypeName(user.type);
            const initials = user.name.split(' ').map(n => n[0]).join('');
            
            html += `
                <div class="participant-item ${isSelected ? 'selected' : ''}" data-user-id="${user.id}">
                    <div class="participant-avatar">
                        ${user.avatar ? 
                            `<img src="${user.avatar}" alt="${user.name}" class="avatar-small">` :
                            `<div class="avatar-placeholder avatar-small">${initials}</div>`
                        }
                    </div>
                    <div class="participant-info">
                        <div class="participant-name">${user.name}</div>
                        <div class="participant-details">${userType} • ${user.position || 'Должность не указана'}</div>
                    </div>
                    <div class="participant-check">
                        ${isSelected ? '✓' : '+'}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    setupParticipantsSearch() {
        const searchInput = document.getElementById('participantsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterParticipants(e.target.value);
            });
        }
    }

    filterParticipants(searchTerm) {
        const participantsList = document.getElementById('participantsList');
        if (!participantsList) return;
        
        const participantItems = participantsList.querySelectorAll('.participant-item');
        const searchLower = searchTerm.toLowerCase().trim();
        
        participantItems.forEach(item => {
            const userName = item.querySelector('.participant-name').textContent.toLowerCase();
            const userDetails = item.querySelector('.participant-details').textContent.toLowerCase();
            
            if (searchTerm === '' || userName.includes(searchLower) || userDetails.includes(searchLower)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    setupParticipantsSelection() {
        const participantsList = document.getElementById('participantsList');
        if (!participantsList) return;
        
        // Обработчик клика на участника
        participantsList.addEventListener('click', (e) => {
            const participantItem = e.target.closest('.participant-item');
            if (participantItem) {
                this.toggleParticipantSelection(participantItem);
            }
        });
        
        // Обработчик удаления выбранного участника
        const selectedParticipants = document.getElementById('selectedParticipants');
        if (selectedParticipants) {
            selectedParticipants.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-participant')) {
                    const userId = parseInt(e.target.getAttribute('data-user-id'));
                    this.removeParticipant(userId);
                }
            });
        }
    }

    toggleParticipantSelection(participantItem) {
        const userId = parseInt(participantItem.getAttribute('data-user-id'));
        const isSelected = participantItem.classList.contains('selected');
        
        if (isSelected) {
            this.removeParticipant(userId);
        } else {
            this.addParticipant(userId);
        }
    }

    addParticipant(userId) {
        const participantItem = document.querySelector(`.participant-item[data-user-id="${userId}"]`);
        if (participantItem) {
            participantItem.classList.add('selected');
            participantItem.querySelector('.participant-check').textContent = '✓';
        }
        
        this.updateSelectedParticipantsList();
    }

    removeParticipant(userId) {
        const participantItem = document.querySelector(`.participant-item[data-user-id="${userId}"]`);
        if (participantItem) {
            participantItem.classList.remove('selected');
            participantItem.querySelector('.participant-check').textContent = '+';
        }
        
        this.updateSelectedParticipantsList();
    }

    updateSelectedParticipantsList() {
        const selectedParticipantsContainer = document.getElementById('selectedParticipants');
        if (!selectedParticipantsContainer) return;
        
        const selectedParticipants = this.getSelectedParticipants();
        selectedParticipantsContainer.innerHTML = this.renderSelectedParticipants(selectedParticipants);
    }

    getSelectedParticipants() {
        const selectedItems = document.querySelectorAll('.participant-item.selected');
        return Array.from(selectedItems).map(item => parseInt(item.getAttribute('data-user-id')));
    }

    saveEvent() {
        const titleInput = document.getElementById('eventTitle');
        const descriptionInput = document.getElementById('eventDescription');
        const dateInput = document.getElementById('eventDate');
        const startTimeInput = document.getElementById('eventStartTime');
        const endTimeInput = document.getElementById('eventEndTime');
        const locationInput = document.getElementById('eventLocation');
        const notesInput = document.getElementById('eventNotes');
        
        if (!titleInput || !descriptionInput || !dateInput || !startTimeInput || !endTimeInput || !locationInput) {
            alert('Ошибка: не все поля формы найдены');
            return;
        }
        
        const title = titleInput.value;
        const description = descriptionInput.value;
        const date = dateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const location = locationInput.value;
        const participants = this.getSelectedParticipants();
        const notes = notesInput ? notesInput.value : '';
        
        if (!title || !description || !date || !startTime || !endTime || !location) {
            alert('Заполните все обязательные поля!');
            return;
        }
        
        if (appData.currentEventForEdit) {
            // Редактирование существующего мероприятия
            appData.currentEventForEdit.title = title;
            appData.currentEventForEdit.description = description;
            appData.currentEventForEdit.date = date;
            appData.currentEventForEdit.startTime = startTime;
            appData.currentEventForEdit.endTime = endTime;
            appData.currentEventForEdit.location = location;
            appData.currentEventForEdit.participants = participants;
            appData.currentEventForEdit.notes = notes;
            
            alert('Мероприятие успешно обновлено!');
        } else {
            // Добавление нового мероприятия
            const newEvent = {
                id: appData.events.length > 0 ? Math.max(...appData.events.map(e => e.id)) + 1 : 1,
                title,
                description,
                date,
                startTime,
                endTime,
                location,
                participants,
                notes
            };
            
            appData.events.push(newEvent);
            alert('Мероприятие успешно добавлено!');
        }
        
        this.closeEventFormModal();
        this.loadEventsForCurrentDate();
        this.renderWeekDays();
        
        // Обновляем в панели модератора
        if (typeof loadEventsForModeration === 'function') {
            loadEventsForModeration();
        }
    }

    closeEventFormModal() {
        const modal = document.getElementById('eventFormModal');
        if (modal) {
            modal.style.display = 'none';
        }
        appData.currentEventForEdit = null;
    }

    openCalendarModal() {
        this.renderCalendar();
        const modal = document.getElementById('calendarModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeCalendarModal() {
        const modal = document.getElementById('calendarModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    renderCalendar() {
        const today = new Date();
        const currentMonth = appData.currentEventsDate.getMonth();
        const currentYear = appData.currentEventsDate.getFullYear();
        
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const firstDayWeekday = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        
        const calendarContent = document.getElementById('calendarContent');
        if (!calendarContent) return;
        
        let calendarHTML = `
            <div style="text-align: center; margin-bottom: 15px; font-size: 18px; font-weight: bold;">
                ${firstDay.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
            </div>
            <div class="calendar-header">
                <div>Пн</div>
                <div>Вт</div>
                <div>Ср</div>
                <div>Чт</div>
                <div>Пт</div>
                <div>Сб</div>
                <div>Вс</div>
            </div>
            <div class="calendar">
        `;
        
        for (let i = 1; i < firstDayWeekday; i++) {
            calendarHTML += `<div class="calendar-day other-month"></div>`;
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEvents = appData.events.some(event => event.date === dateStr);
            const isToday = dateStr === today.toISOString().split('T')[0];
            const isSelected = dateStr === appData.currentEventsDate.toISOString().split('T')[0];
            
            let dayClass = 'calendar-day';
            if (isSelected) dayClass += ' active';
            if (hasEvents) dayClass += ' has-events';
            if (isToday) dayClass += ' today';
            
            calendarHTML += `
                <div class="${dayClass}" data-date="${dateStr}">
                    ${day}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        
        calendarContent.innerHTML = calendarHTML;
        
        // Добавляем обработчики клика на дни
        document.querySelectorAll('.calendar-day:not(.other-month)').forEach(day => {
            day.addEventListener('click', () => {
                const dateStr = day.getAttribute('data-date');
                appData.currentEventsDate = new Date(dateStr);
                this.currentWeekStart = getWeekStartDate(new Date(dateStr));
                this.closeCalendarModal();
                this.loadEventsForCurrentDate();
                this.renderWeekDays();
            });
        });
    }

    openEventModal(eventId) {
        const event = appData.events.find(e => e.id === eventId);
        if (!event) return;
        
        const participantsNames = this.getParticipantsNames(event.participants);
        const modalContent = document.getElementById('eventModalContent');
        const modalTitle = document.getElementById('eventModalTitle');
        const modal = document.getElementById('eventModal');
        
        if (!modalContent || !modalTitle || !modal) return;
        
        modalTitle.textContent = event.title;
        
        const eventHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 10px; color: #2c3e50;">Описание</h3>
                <p>${event.description}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <h4 style="margin-bottom: 5px; color: #666;">Дата</h4>
                    <p>${formatDate(event.date)}</p>
                </div>
                <div>
                    <h4 style="margin-bottom: 5px; color: #666;">Время</h4>
                    <p>${event.startTime} - ${event.endTime}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 5px; color: #666;">Место проведения</h4>
                <p>${event.location}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 5px; color: #666;">Участники</h4>
                <p>${participantsNames}</p>
            </div>
            
            ${event.notes ? `
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 5px; color: #666;">Примечания</h4>
                <p>${event.notes}</p>
            </div>
            ` : ''}
            
            ${appData.currentUser?.type === 'moderator' ? `
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="btn btn-small" onclick="openEditEventModal(${event.id})">Редактировать</button>
                <button class="btn btn-small btn-danger" onclick="deleteEvent(${event.id})">Удалить</button>
            </div>
            ` : ''}
        `;
        
        modalContent.innerHTML = eventHTML;
        modal.style.display = 'flex';
    }
}

// Глобальные функции для обратной совместимости
function openAddEventModal() {
    if (typeof eventsManager !== 'undefined') {
        eventsManager.openEventFormModal();
    }
}

function openEditEventModal(eventId) {
    if (typeof eventsManager !== 'undefined') {
        eventsManager.openEventFormModal(eventId);
    }
}

function closeEventFormModal() {
    if (typeof eventsManager !== 'undefined') {
        eventsManager.closeEventFormModal();
    }
}

function deleteEvent(eventId) {
    const event = appData.events.find(e => e.id === eventId);
    if (!event) return;
    
    if (confirm(`Вы уверены, что хотите удалить мероприятие "${event.title}"?`)) {
        appData.events = appData.events.filter(e => e.id !== eventId);
        
        if (typeof eventsManager !== 'undefined') {
            eventsManager.loadEventsForCurrentDate();
            eventsManager.renderWeekDays();
        }
        
        if (typeof loadEventsForModeration === 'function') {
            loadEventsForModeration();
        }
        
        alert('Мероприятие успешно удалено!');
    }
}