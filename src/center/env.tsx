
import { useEffect, createElement } from 'react';
import { throttle } from 'lodash';
import { SCREEN_SIZE, useEnvStore } from "../stores/env";
import { _track } from 'primeobjects-helper-util/build/cjs/constants';
import { getCache, setCache, getProcess, getWindow } from 'primeobjects-helper-util/build/cjs/core';

export type ENV_DATA_TYPE = {
    height: number,
    width: number,
    scrollTop: number,
    offsetHeight: number,
    scrollHeight: number
}

export const DEFAULT_ENV_CACHE: ENV_DATA_TYPE = {
    height: 0,
    width: 0,
    scrollTop: 0,
    offsetHeight: 0,
    scrollHeight: 0
}

export const LOCAL_ENV_CACHE_KEY = 'env';

export const EnvCenter = (initialState?: Record<string, any>, screenSizes?: SCREEN_SIZE[]) => {

    const envStore = useEnvStore(initialState);
    const process = getProcess();

    const envHandler = throttle(() => {

        const win = getWindow();

        const envCache = getCache(LOCAL_ENV_CACHE_KEY, DEFAULT_ENV_CACHE);

        const env: ENV_DATA_TYPE = {
            width: win.innerWidth,
            height: win.innerHeight,
            offsetHeight: document.documentElement.offsetHeight,
            scrollTop: document.documentElement.scrollTop,
            scrollHeight: document.documentElement.scrollHeight
        }

        let hasChange = false;

        if (envCache.width != env.width || env.width == 0) {
            envStore.setWidth(env.width, screenSizes);
            hasChange = true;
            const body = win?.document?.body;
            if (body) body.className = `body body-${envStore.size}`;
        }

        if (envCache.height != env.height || envCache.scrollTop != env.scrollTop || env.height == 0) {
            hasChange = true;
            envStore.setHeight(env.height, env.offsetHeight, env.scrollTop, env.scrollHeight);
        }

        if (hasChange) {
            setCache(LOCAL_ENV_CACHE_KEY, env);
            if (_track) console.log({ height: env.height, width: env.width, offsetHeight: env.offsetHeight, scrollTop: env.scrollTop, scrollHeight: env.scrollHeight });
        }

    }, 100);

    const scrollHandler = () => {
        envHandler();
    };

    const onBeforeUnload = () => {
        getWindow()?.scrollTo(0, 0);
    }

    useEffect(() => {

        const win = getWindow();

        envHandler();

        if (win.addEventListener) {
            win.addEventListener("resize", envHandler);
            win.addEventListener("scroll", scrollHandler);
            win.addEventListener("beforeunload", onBeforeUnload);
        }

        if (win.attachEvent) {
            win.attachEvent("onresize", envHandler);
            win.attachEvent("onscroll", scrollHandler);
            win.attachEvent("onbeforeunload", onBeforeUnload);
        }

        return () => {
            const win = getWindow();

            if (win.removeEventListener) {
                win.removeEventListener("onresize", envHandler);
                win.removeEventListener("scroll", envHandler);
                win.removeEventListener("beforeunload", onBeforeUnload);
            }

            if (win.detachEvent) {
                win.detachEvent("onresize", envHandler);
                win.detachEvent("onscroll", envHandler);
                win.detachEvent("onbeforeunload", onBeforeUnload);
            }
        }
    }, [process?.browser]);

    return createElement('div', null, '');
};

export default EnvCenter;
