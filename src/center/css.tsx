import React from 'react';
import { useCssStore } from '../stores/css';
import { map } from 'lodash';
import { observer } from 'mobx-react-lite';

export const CssCenter =  observer(() => {

    const cssStore = useCssStore();
    const cssData = JSON.parse(cssStore.data);
    return <>
        {map(Object.keys(cssData), (key) => {
           return <style key={key} id={key}>{cssData[key]}</style>;
        })}
    </>
});

export default CssCenter;