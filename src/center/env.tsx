
import { useEffect, createElement } from 'react';
import { isEmpty, throttle } from 'lodash';
import { useEnvStore } from "../stores/env";
import { _process, _window, _track } from 'primeobjects-helper-util/build/cjs/constants';
import { getLocalCache, setLocalCache } from '../util/local-cache';

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

export const EnvCenter = (initialState?: Record<string, any>) => {
    const envStore = useEnvStore(initialState);
    const envHandler = throttle(() => {
        
        const envCache = getLocalCache(LOCAL_ENV_CACHE_KEY,DEFAULT_ENV_CACHE);
        
        const env: ENV_DATA_TYPE = {
            width: _window.innerWidth,
            height: _window.innerHeight,
            offsetHeight: document.documentElement.offsetHeight,
            scrollTop: document.documentElement.scrollTop,
            scrollHeight: document.documentElement.scrollHeight
        }

        let hasChange = false;

        if (envCache.width != env.width) {
            envStore.setWidth(env.width);
            hasChange = true;
            const body = _window.document.getElementById('body');
            if (body) body.className = `body body-${envStore.size}`;
        }

        if (envCache.height != env.height || envCache.scrollTop != env.scrollTop) {
            hasChange = true;
            envStore.setHeight(env.height, env.offsetHeight, env.scrollTop, env.scrollHeight);
        }

        if (hasChange)
        {
            setLocalCache(LOCAL_ENV_CACHE_KEY, env);
            if (_track) console.log({ height: env.height, width: env.width, offsetHeight: env.offsetHeight, scrollTop: env.scrollTop, scrollHeight: env.scrollHeight });
        }

    }, 100);

    const scrollHandler = () => {
        envHandler();
    };

    const onBeforeUnload = () => {
        if (isEmpty(_window)) return;
        _window.scrollTo(0, 0);
    }

    useEffect(() => {
        //const interval = setInterval(envHandler, 500);
        if (isEmpty(_window)) return;
        envHandler();
        if (_window.addEventListener) {
            _window.addEventListener("resize", envHandler);
            _window.addEventListener("scroll", scrollHandler);
            _window.addEventListener("beforeunload", onBeforeUnload);
        } else {

            _window.attachEvent("onresize", envHandler);
            _window.attachEvent("onscroll", scrollHandler);
            _window.attachEvent("onbeforeunload", onBeforeUnload);
        }

        return () => {

            if (_window.removeEventListener) {
                _window.removeEventListener("onresize", envHandler);
                _window.removeEventListener("scroll", envHandler);
                _window.removeEventListener("beforeunload", onBeforeUnload);
            } else {
                _window.detachEvent("onresize", envHandler);
                _window.detachEvent("onscroll", envHandler);
                _window.detachEvent("onbeforeunload", onBeforeUnload);
            }
        }
    }, [_process?.browser]);

    return createElement('div', null, '');
};

export default EnvCenter;
