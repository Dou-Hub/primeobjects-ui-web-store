import { useMemo } from 'react';
import { _process } from 'primeobjects-helper-util/build/cjs/constants';
import {
    applySnapshot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from 'mobx-state-tree';
import { isEmpty } from 'lodash';

const INIT_VALUE = { data: '{}' };

export const ContextStore = types
    .model({
        data: types.string
    })
    .actions((self: Record<string, any>) => {
        const setData = (newData: Record<string, any>) => {
            self.data = JSON.stringify(newData);
        }
        const getData = () => {
            const data = JSON.parse(self.data);
            return data;
        }
        const setValue = (name: string, value: any) => {
            const data = JSON.parse(self.data);
            data[name] = value;
            self.data = JSON.stringify(data);
        }
        const getValue = (name: string) => {
            const data = JSON.parse(self.data);
            return data[name];
        }
        return { setData, getData, setValue, getValue}
    });


export type IContextStore = Instance<typeof ContextStore>;
export type IContextStoreSnapshotIn = SnapshotIn<typeof ContextStore>;
export type IContextStoreSnapshotOut = SnapshotOut<typeof ContextStore>;

let contextStore: IContextStore = ContextStore.create(INIT_VALUE);

export const initializeContextStore = (snapshot?: Record<string, any>): IContextStore => {
    _process._contextStore = _process._contextStore ?? ContextStore.create(INIT_VALUE);

    if (snapshot && isEmpty(snapshot)) {
        applySnapshot(_process._contextStore, snapshot);
    }
    contextStore = _process._contextStore;
    return contextStore;
}

export function useContextStore(initialState?: Record<string, any>) {
    return useMemo(() => initializeContextStore(initialState), [initialState]);
}

