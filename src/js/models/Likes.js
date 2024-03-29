import { toISOString } from "core-js/fn/date";

export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, publisher, img) {
        const like = { id, title, publisher, img };
        this.likes.push(like);

        // Save data in localStorage
        this.persistData();
        return like;
        
        
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Save data in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = localStorage.getItem('likes');

        // Restoring likes from the local Storage 
        if (storage) this.likes = JSON.parse(storage);
    }
}