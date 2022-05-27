import { useMemo } from 'react';
import { _process } from 'primeobjects-helper-util/build/cjs/constants';
import { find, isEmpty } from 'lodash';
import {
    applySnapshot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from 'mobx-state-tree';

const MESSAGE_STORE_LIST_MAX_SIZE = 100;

export type Message = {
    id: string,
    type: string,
    content: string
}

const MessageItem = types.model({
    id: types.string,
    type: types.string,
    content: types.string
});

const INIT_VALUE = { id: '', type: '', content: '{}', list: [] };

export const MessageStore = types
    .model({
        id: types.string,
        type: types.string,
        content: types.string,
        list: types.array(MessageItem)
    })
    .actions((self) => {
        const addMessage = (message: Message) => {
            self.id = message.id;
            self.type = message.type;
            self.content = message.content;
            self.list.push({ id: self.id, type: self.type, content: self.content });
            if (self.list.length > MESSAGE_STORE_LIST_MAX_SIZE) {
                self.list.shift();
            }
        }
        const getMessage = (id: string): Message | undefined => {
            if (id == self.id) return { id: self.id, type: self.type, content: self.content };
            //try to find from array
            return find(self.list, (item) => item.id == id);
        }
        return { addMessage, getMessage }
    })

export type IMessageStore = Instance<typeof MessageStore>
export type IMessageStoreSnapshotIn = SnapshotIn<typeof MessageStore>
export type IMessageStoreSnapshotOut = SnapshotOut<typeof MessageStore>


let messageStore: IMessageStore = MessageStore.create(INIT_VALUE);

export const initializeMessageStore = (snapshot?:Record<string,any>) : IMessageStore => {
    _process._messageStore = _process._messageStore ?? MessageStore.create(INIT_VALUE);

    if (snapshot && isEmpty(snapshot)) {
        applySnapshot(_process._messageStore, snapshot);
    }
    messageStore = _process._messageStore;
    return messageStore;
}

export function useMessageStore(initialState?: Record<string,any>) {
    return useMemo(() => initializeMessageStore(initialState), [initialState]);
}

