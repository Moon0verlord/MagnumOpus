import { writable } from 'svelte/store';

function createUserId() {
    const key = 'userId';
    const storedValue = sessionStorage.getItem(key);
    const initialValue = storedValue ? JSON.parse(storedValue) : null;
    const store = writable(initialValue);

    store.subscribe(value => {
        sessionStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

export const userId = createUserId();