import React, { useEffect } from 'react';
import { useMessageStore } from './stores/message';
import { isEmpty } from 'lodash';
import { _track, _window, _process } from 'primeobjects-helper-util/build/cjs/constants';

export const sendMessage = (id: string, type: string, data: Record<string, any>) => {
    //console.log({ postMessage: { source: 'local', id, type, data } });
    if (isEmpty(_window)) return;
    _window.postMessage({ source: 'local', id, type, data });
}

export const MessageCenter = () => {

    const messageStore = useMessageStore();

    const messageHandler = (message: Record<string, any>) => {
        const data = message.data;
        if (data.source != 'local') {
            if (_track) console.log({ title: 'non-local message was captured.', message });
            return;
        }
        messageStore.addMessage({ id: data.id, type: data.type, content: JSON.stringify(data.data) });
        if (_track) console.log({ message });
    };

    useEffect(() => {

        if (isEmpty(_window)) return;

        if (_window.addEventListener) {
            _window.addEventListener("message", messageHandler);
        } else {
            _window.attachEvent("onmessage", messageHandler);
        }

        return () => {
            if (_window.removeEventListener) {
                _window.removeEventListener("message", messageHandler);
            } else {
                _window.detachEvent("onmessage", messageHandler);
            }
        }
    }, [_process?.browser]);

    return <></>;
};


export default MessageCenter;