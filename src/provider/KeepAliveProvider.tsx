import React, { createContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { BackControlType, BackHistoryType } from '../../types';
import _debounce from 'lodash/debounce';

interface PropsType {
  children: React.ReactNode;
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

export const KeepAliveProvider = ({ children, alwaysRemember = false, maxPage = 10 }: PropsType) => {
  const router = useRouter();
  const { pathname } = router;
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
  }, [pathname]);

  return (
    <BackControlContext.Provider value={{ ...backHistoryStore, alwaysRemember, maxPage: maxPage > 17 ? 15 : maxPage }}>
      {children}
    </BackControlContext.Provider>
  );
};

export default KeepAliveProvider;
