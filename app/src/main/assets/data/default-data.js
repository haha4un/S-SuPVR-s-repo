const appData = {
    catalogs: [
        { 
            id: 1, 
            name: "Повестки заседаний 3C", 
            description: "Повестки заседаний законодательного собрания",
            files: [],
            links: []
        },
        { 
            id: 2, 
            name: "Новостная лента", 
            description: "Актуальные новости и события",
            files: [],
            links: []
        },
        { 
            id: 3, 
            name: "План мероприятий", 
            description: "Календарь мероприятий и планы",
            files: [],
            links: []
        },
        { 
            id: 4, 
            name: "Паспорт закона", 
            description: "Документы и паспорта законов",
            files: [],
            links: []
        },
        { 
            id: 5, 
            name: "Указы губернатора", 
            description: "Указы и распоряжения губернатора",
            files: [],
            links: []
        },
        { 
            id: 6, 
            name: "Постановления Правительства", 
            description: "Постановления и решения правительства",
            files: [],
            links: []
        },
        { 
            id: 7, 
            name: "Исполнение бюджета", 
            description: "Отчеты об исполнении бюджета",
            files: [],
            links: []
        },
        { 
            id: 8, 
            name: "Материалы КС", 
            description: "Материалы Конституционного суда",
            files: [],
            links: []
        },
        { 
            id: 9, 
            name: "Сервисы", 
            description: "Дополнительные сервисы и инструменты",
            files: [],
            links: []
        }
    ],
    
    users: [
        { 
            id: 1, 
            name: "Иванов И.И.", 
            email: "i.ivanov@permkray.ru", 
            password: "123", 
            type: "deputy",
            position: "Депутат законодательного собрания",
            phone: "+7 (342) 123-45-67",
            avatar: "",
            catalogOrder: []
        },
        { 
            id: 2, 
            name: "Петров П.П.", 
            email: "p.petrov@permkray.ru", 
            password: "123", 
            type: "assistant",
            position: "Помощник депутата",
            phone: "+7 (342) 234-56-78",
            avatar: "",
            catalogOrder: []
        },
        { 
            id: 3, 
            name: "Сидоров С.С.", 
            email: "s.sidorov@permkray.ru", 
            password: "123", 
            type: "moderator",
            position: "Администратор системы",
            phone: "+7 (342) 345-67-89",
            avatar: "",
            catalogOrder: []
        },
        { 
            id: 4, 
            name: "Кузнецов А.В.", 
            email: "a.kuznetsov@permkray.ru", 
            password: "123", 
            type: "deputy",
            position: "Депутат",
            phone: "+7 (342) 456-78-90",
            avatar: "",
            catalogOrder: []
        },
        { 
            id: 5, 
            name: "Смирнова О.Л.", 
            email: "o.smirnova@permkray.ru", 
            password: "123", 
            type: "assistant",
            position: "Помощник депутата",
            phone: "+7 (342) 567-89-01",
            avatar: "",
            catalogOrder: []
        }
    ],
    
    events: [
        {
            id: 1,
            title: "Заседание комитета по бюджету",
            description: "Обсуждение проекта бюджета на следующий год",
            date: new Date().toISOString().split('T')[0],
            startTime: "10:00",
            endTime: "12:00",
            location: "Зал заседаний №1",
            participants: [1, 2],
            notes: "Принести все необходимые документы"
        },
        {
            id: 2,
            title: "Встреча с избирателями",
            description: "Прием граждан по личным вопросам",
            date: new Date().toISOString().split('T')[0],
            startTime: "14:00",
            endTime: "16:00",
            location: "Общественная приемная",
            participants: [1, 5],
            notes: "Подготовить ответы на частые вопросы"
        },
        {
            id: 3,
            title: "Совещание по благоустройству",
            description: "Планирование работ по благоустройству территории",
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            startTime: "11:00",
            endTime: "13:00",
            location: "Кабинет 305",
            participants: [1, 2, 4],
            notes: "Принести план территории"
        }
    ],
    
    currentUser: null,
    viewingUser: null,
    currentCatalog: null,
    currentCatalogForSettings: null,
    currentEventsDate: new Date(),
    currentWeekStart: getWeekStartDate(new Date()),
    currentEventForEdit: null
};

function getWeekStartDate(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// Тестовые данные для проверки
console.log('Данные приложения загружены:', {
    пользователей: appData.users.length,
    каталогов: appData.catalogs.length,
    мероприятий: appData.events.length
});