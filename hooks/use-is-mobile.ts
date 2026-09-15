import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Function to evaluate the current window width
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Run the check immediately on initial mount
        handleResize();

        // Attach the event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;