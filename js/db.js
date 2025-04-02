let db;

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('TrilhasAppDB', 2);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            
            // Tabela de usuários
            if (!db.objectStoreNames.contains('users')) {
                const usersStore = db.createObjectStore('users', { keyPath: 'id' });
                usersStore.createIndex('email', 'email', { unique: true });
            }
            
            // Tabela de inscrições
            if (!db.objectStoreNames.contains('submissions')) {
                const submissionsStore = db.createObjectStore('submissions', { keyPath: 'id' });
                submissionsStore.createIndex('userId', 'userId', { unique: false });
                submissionsStore.createIndex('date', 'submissionDate', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject('Error opening database');
        };
    });
};

// Exportar para usar em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initDB, db };
}