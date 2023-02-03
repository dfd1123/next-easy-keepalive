import React, {
  SetStateAction,
  useContext,
  useEffect, useLayoutEffect,
  useRef,
  useState
} from 'react';
import {
  BackHistoryType,
  CacheDataType, KeepAliveHookOptions,
} from '../../types';
import { BackControlContext } from '../provider/KeepAliveProvider';

export const useKeepAlive = (key:string, option?:KeepAliveHookOptions) => {
  const { alwaysRemember: optionAlwaysRemember = true, store = true } = option || {};
  const { current: backContext, alwaysRemember: allAlwaysRemember, maxPage } = useContext(BackControlContext);
  const alwaysRemember = allAlwaysRemember && optionAlwaysRemember;

  const pathName =  typeof window !== 'undefined' && window.location.pathname ? window.location.pathname : 'temp';

  // Make it visible to the window object for easy debugging in debug tools
  if(typeof window !== 'undefined') window.__BACK_HISTORY__ = backContext.backHistory;

  const tempStore = useRef<CacheDataType>({
    state: {},
    ref: {},
  });

  const getCacheData = () : CacheDataType | undefined => {
    const pageCacheData = backContext.backHistory[pathName]?.data;
    return (backContext.isBack || alwaysRemember) && pageCacheData ? pageCacheData[key] : undefined;
  };

  // useEffect hook that runs only when not going back
  const useNotBackEffect = (func: Function, deps: any[] = []) => useEffect(() => {
    const pageCacheData = backContext.backHistory[pathName]?.data || {};
    if (!backContext.isBack || !pageCacheData[key]) {
      func();
    }
  }, [...deps]);

  // useEffect hook that runs only when going back
  const useBackActive = (func: Function, deps: any[] = []) => useEffect(() => {
    const pageCacheData = backContext.backHistory[pathName]?.data || {};
    if (backContext.isBack && pageCacheData[key]) {
      func();
    }
  }, [...deps]);

  const useMemState = <S>(state: S, keyName: string) => {
    const cacheData = getCacheData();
    const cacheState = cacheData && cacheData.state[keyName];
    const resultState = useState<typeof state>(cacheState ?? state);

    [tempStore.current.state[keyName]] = resultState;

    return resultState as [S, React.Dispatch<SetStateAction<S>>];
  };

  const useMemRef = <S>(ref: S, keyName: string) => {
    const cacheData = getCacheData();
    const cacheRef = cacheData && cacheData.ref[keyName].current;
    const resultRef = useRef<typeof ref>(cacheRef ?? ref);

    tempStore.current.ref[keyName] = resultRef;

    return resultRef as React.MutableRefObject<S>;
  };

  useLayoutEffect(() => {
    if (backContext.isBack || alwaysRemember) {
      if (backContext.backHistory[pathName]) {
        const backHistory = backContext.backHistory[pathName] as BackHistoryType;
        if (backHistory.scrollPos > 0) window.scrollTo(0, backHistory.scrollPos);
      }
    }
  } ,[])

  useEffect(() => {
    return () => {
      if (store) {
        const { state, ref } = tempStore.current;
        const prevData = backContext.backHistory[pathName]?.data || {};

        let history = {
          ...backContext.backHistory,
          [pathName]: {
            order: Object.keys(backContext.backHistory).length,
            scrollPos: backContext.backHistory[pathName]?.scrollPos ?? 0,
            data: { ...prevData, [key]: { state, ref } },
          },
        };

        if (Object.entries(history).length > maxPage) {
          history = Object.entries(history).sort(([,a], [,b]) => (b?.order || 0) - (a?.order || 0)).filter((_, idx) => idx !== 0).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        }

        backContext.backHistory = history;
      }
    };
  }, []);

  return {
    isBack: backContext.isBack,
    useNotBackEffect,
    useBackActive,
    useMemState,
    useMemRef,
  };
};

export default useKeepAlive;
