import React from 'react';

export interface BackControlType {
  backHistory: {
    [key: string]: BackHistoryType | undefined;
  };
  isBack: boolean;
}

export interface BackHistoryType {
  order: number;
  scrollPos: number;
  data?: { [key:string] : CacheDataType } | undefined;
}

export interface CacheDataType {
  state: { [key: string]: any };
  ref: { [key: string]: React.MutableRefObject<any> };
}

export interface KeepAliveHookOptions {
  alwaysRemember?: boolean;
  keepScroll?: boolean;
  store?: boolean;
}

export type UseMemRefHook = <S>(ref: S, keyName: string) => React.MutableRefObject<S>

export type UseMemStateHook = <S>(state: S, keyName: string) => [S, React.Dispatch<React.SetStateAction<S>>];

export type UseNotBackEffectHook = (func: Function) => any;

export type UseBackActiveHook = (func: Function) => any;

declare function useKeepAlive(key: string, option?: KeepAliveHookOptions): {isBack: any, useNotBackEffect: UseNotBackEffectHook, useMemState: UseMemStateHook, useBackActive: UseBackActiveHook, useMemRef: UseMemRefHook};
