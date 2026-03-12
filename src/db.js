/**
 * VideoDB - A simple IndexedDB wrapper to store anime video files locally.
 */
export const VideoDB = {
    dbName: 'AnimeUZ_Videos',
    dbVersion: 2,
    storeName: 'videos',
    posterStore: 'posters',

    _getDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
                if (!db.objectStoreNames.contains(this.posterStore)) {
                    db.createObjectStore(this.posterStore);
                }
            };

        });
    },

    /**
     * Store a video file (Blob) in the database.
     * @param {string|number} animeId 
     * @param {number} epNum 
     * @param {Blob} blob 
     */
    async saveVideo(animeId, epNum, blob) {
        const db = await this._getDB();
        const key = `${animeId}_${epNum}`;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(blob, key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    },

    /**
     * Retrieve a video file (Blob) from the database.
     * @param {string|number} animeId 
     * @param {number} epNum 
     */
    async getVideo(animeId, epNum) {
        const db = await this._getDB();
        const key = `${animeId}_${epNum}`;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Delete a video file from the database.
     * @param {string|number} animeId 
     * @param {number} epNum 
     */
    async deleteVideo(animeId, epNum) {
        const db = await this._getDB();
        const key = `${animeId}_${epNum}`;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    },

    /**
     * Delete all videos associated with an anime.
     * @param {string|number} animeId 
     */
    async deleteAnimeVideos(animeId) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.openCursor();
            request.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    if (cursor.key.startsWith(`${animeId}_`)) {
                        cursor.delete();
                    }
                    cursor.continue();
                } else {
                    resolve(true);
                }
            };
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Store a poster file (Blob) in the database.
     * @param {string|number} animeId 
     * @param {Blob} blob 
     */
    async savePoster(animeId, blob) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.posterStore], 'readwrite');
            const store = transaction.objectStore(this.posterStore);
            const request = store.put(blob, animeId.toString());
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    },

    /**
     * Retrieve a poster file (Blob) from the database.
     * @param {string|number} animeId 
     */
    async getPoster(animeId) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.posterStore], 'readonly');
            const store = transaction.objectStore(this.posterStore);
            const request = store.get(animeId.toString());
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Delete a poster file from the database.
     * @param {string|number} animeId 
     */
    async deletePoster(animeId) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.posterStore], 'readwrite');
            const store = transaction.objectStore(this.posterStore);
            const request = store.delete(animeId.toString());
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }
};

