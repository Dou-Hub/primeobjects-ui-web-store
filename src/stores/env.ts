import { useMemo } from 'react';
import { _process } from 'primeobjects-helper-util/build/cjs/constants';
import {
    applySnapshot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from 'mobx-state-tree';
import { isArray, isEmpty, isNil } from 'lodash';



export type SCREEN_SIZE = { name: string, min: number, max: number }

export const DEFAULT_SCREEN_SIZES: SCREEN_SIZE[] = [
    { name: "2xs", min: 360, max: 479 },
    { name: "xs", min: 480, max: 639 },
    { name: "sm", min: 640, max: 767 },
    { name: "md", min: 768, max: 1023 },
    { name: "lg", min: 1024, max: 1279 },
    { name: "xl", min: 1280, max: 1535 },
    { name: "2xl", min: 1536, max: 100000 }
]

export type ENV_DATA_TYPE = {
    height: number,
    width: number,
    scrollTop: number,
    offsetHeight: number,
    scrollHeight: number,
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export const INIT_ENV_VALUE = {
    width: 0,
    height: 0,
    offsetHeight: 0,
    scrollTop: 0,
    scrollHeight: 0,
    offsetToBottom: 0,
    size: '',
    data: '{}'
}

export const getScreenSize = (width: number, screenSizes?: SCREEN_SIZE[]) => {
    const sizes: SCREEN_SIZE[] = screenSizes && isArray(screenSizes) ? screenSizes : DEFAULT_SCREEN_SIZES;
    let result = '';
    for (let i = 0; i < sizes?.length && result.length==0; i++)
    {
        const size = sizes[i];
        if (width>size.min && width<size.max)
        {
            result = size.name;
        }
    }
    return result;
}

export const EnvStore = types
    .model({
        width: types.number,
        height: types.number,
        offsetHeight: types.number,
        scrollTop: types.number,
        scrollHeight: types.number,
        offsetToBottom: types.number,
        size: types.string,
        data: types.string
    })
    .actions((self: Record<string, any>) => {

        const setWidth = (width: number, screenSizes?: SCREEN_SIZE[]) => {
            self.width = width;
            self.size = getScreenSize(width, screenSizes);
        }

        const setHeight = (height: number, offsetHeight: number, scrollTop: number, scrollHeight: number) => {
            self.height = height;
            self.offsetHeight = offsetHeight;
            self.scrollTop = scrollTop;
            self.scrollHeight = scrollHeight;
            self.offsetToBottom = offsetHeight - height - scrollTop;
        }

        const setData = (newData: Record<string, any>) => {
            self.data = JSON.stringify(newData);
        }

        const getData = () => {
            const data = JSON.parse(self.data);
            return data;
        }

        const setValue = (name: string, value: any) => {
            const data = JSON.parse(self.data);
            if (isNil(value)) {
                delete data[name];
            }
            else {
                data[name] = value;
            }

            self.data = JSON.stringify(data);
        }
        const getValue = (name: string) => {
            const data = JSON.parse(self.data);
            return data[name];
        }

        return { setWidth, setHeight, setValue, getValue, setData, getData };
    })

export type IEnvStore = Instance<typeof EnvStore>;
export type IEnvStoreSnapshotIn = SnapshotIn<typeof EnvStore>;
export type IEnvStoreSnapshotOut = SnapshotOut<typeof EnvStore>;

let envStore: IEnvStore = EnvStore.create(INIT_ENV_VALUE);

export const initializeEnvStore = (snapshot?: Record<string, any>): IEnvStore => {
    _process._envStore = _process._envStore ?? EnvStore.create(INIT_ENV_VALUE);

    if (snapshot && isEmpty(snapshot)) {
        applySnapshot(_process._envStore, snapshot);
    }
    envStore = _process._envStore;
    return envStore;
}

export function useEnvStore(initialState?: Record<string, any>) {
    return useMemo(() => initializeEnvStore(initialState), [initialState]);
}

