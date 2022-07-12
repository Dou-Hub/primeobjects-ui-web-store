//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
//
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import React, { useEffect } from "react";
import { getGlobalObject, isNonEmptyString } from "primeobjects-helper-util/build/cjs/core";
import { useCssStore } from "./stores/css";

export const CSS = (props: Record<string, any>) => {
    const { id, content } = props;
    const cssStore = useCssStore();

    useEffect(() => {
        const g: any = getGlobalObject();
        if (!g.css) g.css = {};
        if (isNonEmptyString(id) && !g.css[id]) {
            g.css[id] = true;
        }
        cssStore.setCSS(id, content);
    }, [id, content]);

    return <></>;
};

export default CSS;
