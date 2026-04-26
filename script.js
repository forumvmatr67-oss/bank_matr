class MiniBank {
    constructor() {
        this.loadData();
    }

    // Загрузка данных из localStorage
    loadData() {
        const saved = localStorage.getItem('miniBankData');
        if (saved) {
            const data = JSON.parse(saved);
            this.cards = data.cards;
            this.transactions = data.transactions;
        } else {
            this.cards = [];
            this.transactions = [];
        }
    }

    // Сохранение данных в localStorage
    saveData() {
        localStorage.setItem('miniBankData', JSON.stringify({
            cards: this.cards,
            transactions: this.transactions
        }));
    }

    // Генерация уникального номера карты
    generateCardNumber() {
        let num;
        do {
            num = 'MAT' + Math.floor(10000 + Math.random() * 90000);
        } while (this.cards.some(card => card.cardNumber === num));
        return num;
    }

    // Создание новой карты
    createCard(playerName) {
        if (!playerName) throw new Error('Имя игрока не указано');

        const cardNumber = this.generateCardNumber();
        const newCard = {
            cardNumber,
            playerName,
            balance: 0
        };

        this.cards.push(newCard);
        this.saveData();
        return newCard;
    }

    // Поиск карты по номеру
    findCard(cardNumber) {
        return this.cards.find(card => card.cardNumber === cardNumber);
    }

    // Вклад на карту
    deposit(cardNumber, amount) {
        if (amount <= 0) throw new Error('Сумма должна быть положительной');

        const card = this.findCard(cardNumber);
        if (!card) throw new Error('Карта не найдена');

        card.balance += amount;

        this.transactions.push({
            type: 'вклад',
            from: 'наличные',
            to: cardNumber,
            amount,
            date: new Date().toLocaleString()
        });

        this.saveData();
        return `Внесено ${amount} руб. на карту ${cardNumber}. Новый баланс: ${card.balance} руб.`;
    }

    // Перевод между картами
    transfer(fromCard, toCard, amount) {
        if (amount <= 0) throw new Error('Сумма должна быть положительной');

        const sender = this.findCard(fromCard);
        const receiver = this.findCard(toCard);

        if (!sender) throw new Error('Карта отправителя не найдена');
        if (!receiver) throw new Error('Карта получателя не найдена');
        if (sender.balance < amount) throw new Error('Недостаточно средств на карте');

        sender.balance -= amount;
        receiver.balance += amount;

        this.transactions.push({
            type: 'перевод',
            from: fromCard,
            to: toCard,
            amount,
            date: new Date().toLocaleString()
        });

        this.saveData();
        return `Переведено ${amount} руб. с карты ${fromCard} на карту ${toCard}`;
    }

    // Получение баланса карты
    getBalance(cardNumber) {
        const card = this.findCard(cardNumber);
        if (!card) throw new Error('Карта не найдена');
        return `Баланс карты ${cardNumber}: ${card.balance} руб.`;
    }

    // История операций для карты
    getHistory(cardNumber) {
        const history = this.transactions.filter(
            t => t.from === cardNumber || t.to === cardNumber
        );
        return history.length > 0 ? history : ['Операций нет'];
    }
}

// Экземпляр банка
const bank = new MiniBank();

// Функции для удобного вызова из консоли
window.createCard = (name) => {
    try {
        const card = bank.createCard(name);
        console.log('Карта создана:', card);
        return card;
    } catch (e) {
        console.error('Ошибка:', e.message);
    }
};

window.deposit = (cardNum, amount) => {
    try {
        const result = bank.deposit(cardNum, amount);
        console.log(result);
        return result;
    } catch (e) {
        console.error('Ошибка:', e.message);
    }
};

window.transfer = (from, to, amount) => {
    try {
        const result = bank.transfer(from, to, amount);
        console.log(result);
        return result;
    } catch (e) {
        console.error('Ошибка:', e.message);
    }
};

window.getBalance = (cardNum) => {
    try {
        const balance = bank.getBalance(cardNum);
        console.log(balance);
        return balance;
    } catch (e) {
        console.error('Ошибка:', e.message);
    }
};

window.getHistory = (cardNum) => {
    try {
        const history = bank.getHistory(cardNum);
        console.table(history);
        return history;
    } catch (e) {
        console.error('Ошибка:', e.message);
    }
};
