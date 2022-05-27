
import { useEffect, createElement } from 'react';
import { isEmpty, throttle } from 'lodash';
import { useEnvStore } from "./stores/env";
import { _process, _window, _track } from 'primeobjects-helper-util/build/cjs/constants';

const envCache = {
    height: 0,
    width: 0,
    scrollTop: 0,
    offsetHeight: 0
};

export const EnvCenter = (initialState?: Record<string, any>) => {
    const envStore = useEnvStore(initialState);
    const envHandler = throttle(() => {
        
        //if (isEmpty(_window)) return ()=>{};

        const env = {
            width: _window.innerWidth,
            height: _window.innerHeight,
            offsetHeight: document.documentElement.offsetHeight,
            scrollTop: document.documentElement.scrollTop,
            scrollHeight: document.documentElement.scrollHeight
        }

        if (envCache.width != env.width) {
            envCache.width = env.width;
            envStore.setWidth(env.width);
            const body = _window.document.getElementById('body');
            if (body) body.className = `body body-${envStore.size}`;
        }

        if (envCache.height != env.height || envCache.scrollTop != env.scrollTop) {

            envCache.height = env.height;
            envCache.scrollTop = env.scrollTop;

            envStore.setHeight(env.height, env.offsetHeight, env.scrollTop, env.scrollHeight);
        }

        if (_track) console.log({ height: env.height, width: env.width, offsetHeight: env.offsetHeight, scrollTop: env.scrollTop, scrollHeight: env.scrollHeight });

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