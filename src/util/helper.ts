const KEY = ''

export const setToLocalStorage = (key: string, value: any) => {
    key = `${KEY}${key}`;
    localStorage.setItem(key, value);
}

export const getLocalStorage = (key: string) => {
    key = `${KEY}${key}`;
    return localStorage.getItem(key);
}

