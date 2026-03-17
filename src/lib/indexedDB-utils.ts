const INDEXED_DB_VERSION = 2; // Increment this version number when you change the database schema
const INDEXED_DB_NAME = "game_db";
export const INDEXED_DB_SAVE_TABLE = "saves";

export function initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);
        // check if the object store exists
        request.onupgradeneeded = function (_event) {
            let db = request.result;
            if (!db.objectStoreNames.contains(INDEXED_DB_SAVE_TABLE)) {
                // create the object store
                let objectStore = db.createObjectStore(INDEXED_DB_SAVE_TABLE, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("id", "id", { unique: true });
                objectStore.createIndex("date", "date", { unique: false });
                objectStore.createIndex("name", "name", { unique: false });
                objectStore.createIndex("gameVersion", "gameVersion", { unique: false });
            }
        };

        request.onsuccess = function (_event) {
            resolve();
        };
        request.onerror = function (event) {
            console.error("Error opening indexDB", event);
            reject();
        };
    });
}

export async function putRowIntoIndexDB<T extends {}>(tableName: string, data: T): Promise<T> {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(INDEXED_DB_NAME);

        request.onsuccess = function (_event) {
            let db = request.result;
            // run onupgradeneeded before onsuccess
            if (!db.objectStoreNames.contains(tableName)) {
                console.error("Object store rescues does not exist");
                reject();
            }
            let transaction = db.transaction([tableName], "readwrite");
            let objectStore = transaction.objectStore(tableName);
            let setRequest = objectStore.put(data);
            setRequest.onsuccess = function (_event) {
                resolve(data);
            };
            setRequest.onerror = function (event) {
                console.error("Error adding save data to indexDB", event);
                reject();
            };
        };
        request.onerror = function (event) {
            console.error("Error adding save data to indexDB", event);
        };
    });
}

export async function getRowFromIndexDB<T extends {}>(tableName: string, id: any): Promise<T | null> {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(INDEXED_DB_NAME);
        request.onsuccess = function (_event) {
            let db = request.result;
            // check if the object store exists
            if (!db.objectStoreNames.contains(tableName)) {
                resolve(null);
                return;
            }
            let transaction = db.transaction([tableName], "readwrite");
            let objectStore = transaction.objectStore(tableName);
            let getRequest = objectStore.get(id);
            getRequest.onsuccess = function (_event) {
                resolve(getRequest.result);
            };
            getRequest.onerror = function (event) {
                console.error("Error getting save data from indexDB", event);
                reject();
            };
        };
        request.onerror = function (event) {
            console.error("Error opening indexDB", event);
            reject();
        };
    });
}

export async function getLastRowFromIndexDB<T extends {}>(tableName: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(INDEXED_DB_NAME);
        request.onsuccess = function (_event) {
            let db = request.result;
            // check if the object store exists
            if (!db.objectStoreNames.contains(tableName)) {
                resolve(null);
                return;
            }
            let transaction = db.transaction([tableName], "readwrite");
            let objectStore = transaction.objectStore(tableName);
            let getRequest = objectStore.openCursor(null, "prev");
            getRequest.onsuccess = function (_event) {
                let cursor = getRequest.result;
                if (cursor) {
                    resolve(cursor.value);
                } else {
                    resolve(null);
                }
            };
            getRequest.onerror = function (event) {
                console.error("Error getting save data from indexDB", event);
                reject();
            };
        };
        request.onerror = function (event) {
            console.error("Error opening indexDB", event);
            reject();
        };
    });
}

export async function deleteRowFromIndexDB(tableName: string, id: any): Promise<void> {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(INDEXED_DB_NAME);
        request.onsuccess = function (_event) {
            let db = request.result;
            let transaction = db.transaction([tableName], "readwrite");
            let objectStore = transaction.objectStore(tableName);
            let deleteRequest = objectStore.delete(id);
            deleteRequest.onsuccess = function (_event) {
                resolve();
            };
            deleteRequest.onerror = function (event) {
                console.error("Error deleting save data from indexDB", event);
                reject();
            };
        };
        request.onerror = function (event) {
            console.error("Error deleting save data from indexDB", event);
        };
    });
}

export async function getListFromIndexDB<T extends {}>(
    tableName: string,
    options: {
        order?: { field: keyof T; direction: IDBCursorDirection };
        pagination?: { offset: number; limit: number };
    } = {}
): Promise<T[]> {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(INDEXED_DB_NAME);
        request.onsuccess = function (_event) {
            let db = request.result;
            // check if the object store exists
            if (!db.objectStoreNames.contains(tableName)) {
                resolve([]);
                return;
            }
            let transaction = db.transaction([tableName], "readwrite");
            let objectStore = transaction.objectStore(tableName);
            let getRequest = options.order
                ? objectStore.index(options.order.field as string).openCursor(null, options.order.direction)
                : objectStore.openCursor();
            let results: T[] = [];
            let counter = 0;
            let limit = options.pagination?.limit ?? Infinity;
            let offset = options.pagination?.offset ?? 0;
            let advanced = false;
            getRequest.onsuccess = (_event) => {
                let cursor = getRequest.result;
                if (cursor) {
                    if (counter >= offset) {
                        results.push(cursor.value);
                        if (results.length >= limit) {
                            resolve(results);
                            advanced = true;
                        }
                    }
                    counter++;
                    cursor.continue();
                } else {
                    if (!advanced) {
                        resolve(results);
                    }
                }
            };
            getRequest.onerror = function (event) {
                console.error("Error getting save data from indexDB", event);
                reject();
            };
        };
        request.onerror = function (event) {
            console.error("Error opening indexDB", event);
            reject();
        };
    });
}
