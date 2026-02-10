import { createMMKV } from 'react-native-mmkv';


type TUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export const storage = createMMKV({
    id: 'my-app-storage',
})

export type StorageKeys = 'user' | 'token' | 'isUserOnboarded';


// Setters

const setUser = (user: TUser) => {
    return setObject<TUser>('user', user);
};

const setToken = (token: string) => {
    return storage.set('token', token);
};

const setIsUserOnboarded = (isOnboarded: boolean) => {
    return storage.set('isUserOnboarded', isOnboarded);
};

// Getters

const getUser = () => {
    return getObject<TUser>('user');
};

const getToken = () => {
    return storage.getString('token');
};

const getIsUserOnboarded = () => {
    return storage.getBoolean('isUserOnboarded');
};


const removeItem = (key: StorageKeys) => {
    storage.remove(key)
}

const getObject = <T>(key: StorageKeys) => {
    const value = storage.getString(key) as T as string
    const parsedValue = value ? JSON.parse(value) : null
    return parsedValue as T | null
}

const setObject = <T>(key: StorageKeys, value: T) => {
    storage.set(key, JSON.stringify(value))
}


export const storageManager = {
    setUser,
    setToken,
    setIsUserOnboarded,
    getUser,
    getToken,
    getIsUserOnboarded,
    removeItem,
    getObject,
    setObject,
}

// storage.clearAll();


storageManager.setToken('6d96913a-e0f8-11f0-9918-1a6b275109e9')