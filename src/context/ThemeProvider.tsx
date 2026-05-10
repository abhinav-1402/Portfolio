import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

export const ThemeProvider = ({children} :  {children: ReactNode}) => {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const root = window.document.documentElement;
        if(theme === 'dark'){
            root.classList.add('dark');
        }else{
            root.classList.remove('dark')
        }
    }, [theme]);

    const toggleTheme =(() => {
        setTheme((prev) => prev === 'light' ?  'dark' : 'light');
    });

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};