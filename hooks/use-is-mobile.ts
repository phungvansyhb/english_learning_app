import { useState, useLayoutEffect, useSyncExternalStore } from 'react';

const useIsMobile = (breakpoint = 768) => {
    return useSyncExternalStore(
        (callback) => {
            const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
            mediaQuery.addEventListener('change', callback);
            return () => mediaQuery.removeEventListener('change', callback);
        },
        () => window.innerWidth < breakpoint,
        () => false
    );
};

export default useIsMobile;