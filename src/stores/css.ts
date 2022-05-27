import { useMemo } from 'react';
import { _process } from 'primeobjects-helper-util/build/cjs/constants';
import {
    applySnapshot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types
} from 'mobx-state-tree';
import { isEmpty, isNil } from 'lodash';

const INIT_VALUE = {
    data: '{}'
}

export const CssStore = types
    .model({
        data: types.string
    })
    .actions((self: Record<string, any>) => {
        const setCSS = (id: string, content: string) => {
            const data = JSON.parse(self.data);
            if (isNil(content)) {
                delete data[id];
            }
            else {
                data[id] = content;
            }
            self.data = JSON.stringify(data);
        }

        const getCSS = (id: string) => {
            const data = JSON.parse(self.data);
            return data[id];
        }

        return { getCSS, setCSS };
    })

export type ICssStore = Instance<typeof CssStore>;
export type ICssStoreSnapshotIn = SnapshotIn<typeof CssStore>;
export type ICssStoreSnapshotOut = SnapshotOut<typeof CssStore>;

let cssStore: ICssStore = CssStore.create(INIT_VALUE);

export const initializeCssStore = (snapshot?: Record<string, any>): ICssStore => {
    _process._cssStore = _process._cssStore ?? CssStore.create(INIT_VALUE);

    if (snapshot && isEmpty(snapshot)) {
        applySnapshot(_process._cssStore, snapshot);
    }
    cssStore = _process._cssStore;
    return cssStore;
}

export function useCssStore(initialState?: Record<string, any>) {
    return useMemo(() => initializeCssStore(initialState), [initialState]);
}

