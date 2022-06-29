import React, { useEffect } from 'react';
import { useMessageStore } from '../stores/message';
import { _track } from 'primeobjects-helper-util/build/cjs/constants';
import { getProcess, getWindow } from 'primeobjects-helper-util/build/cjs/core';

export const sendMessage = (id: string, type: string, data: Record<string, any>) => {
    getWindow()?.postMessage({ source: 'local', id, type, data });
}

export const MessageCenter = () => {

    const messageStore = useMessageStore();
    const process = getProcess();

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
        const win = getWindow();
        if (win?.addEventListener) win?.addEventListener("message", messageHandler);
        if (win?.attachEvent) win?.attachEvent("onmessage", messageHandler);

        return () => {
            const win = getWindow();
            if (win?.removeEventListener) win?.removeEventListener("message", messageHandler);
            if (win?.detachEvent) win?.detachEvent("onmessage", messageHandler);
        }
    }, [process?.browser]);

return <></>;
};


export default MessageCenter;