import React, { createContext, useEffect, useRef } from 'react';
// import { usePathname } from 'next/navigation';
import { BackControlType, BackHistoryType } from '../../types';
import _debounce from 'lodash/debounce';
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context';
import {NextRouter} from 'next/dist/client/router';
import {BaseRouter} from 'next/dist/shared/lib/router/router';

interface PropsType {
  children: React.ReactNode;
  router: BaseRouter | NextRouter | AppRouterInstance;
  alwaysRemember?: boolean;
  maxPage?: number;
}

const initialValue: { current: BackControlType, alwaysRemember: boolean, maxPage: number } = {
  current: {
    backHistory: {},
    isBack: false,
  },
  alwaysRemember: false,
  maxPage: 10,
};

export const BackControlContext = createContext(initialValue);

export const KeepAliveProvider = ({ children, router, alwaysRemember = false, maxPage = 10 }: PropsType) => {
  // const pathname = usePathname();
  const backHistoryStore = useRef(initialValue.current);
  const scrollPos = useRef(0);

  useEffect(() => {
    const pathName = window.location.pathname;

    const saveScroll = _debounce(() => {
      scrollPos.current = window.scrollY || window.pageYOffset;
    }, 100);

    const backEventCatch = () => {
      backHistoryStore.current.isBack = true;
      setTimeout(() => {
        backHistoryStore.current.isBack = false;
      }, 500);
    };

    window.removeEventListener('popstate', backEventCatch);
    window.addEventListener('popstate', backEventCatch);

    window.removeEventListener('scroll', saveScroll);
    window.addEventListener('scroll', saveScroll);

    return () => {
      window.removeEventListener('scroll', saveScroll);
      window.removeEventListener('popstate', backEventCatch);

      if (backHistoryStore.current.backHistory[pathName]) {
        (backHistoryStore.current.backHistory[pathName] as BackHistoryType).scrollPos = scrollPos.current;
      }
    };
  }, [router]);

  return (
    <BackControlContext.Provider value={{ ...backHistoryStore, alwaysRemember, maxPage: maxPage > 17 ? 15 : maxPage }}>
      {children}
    </BackControlContext.Provider>
  );
};

export default KeepAliveProvider;
