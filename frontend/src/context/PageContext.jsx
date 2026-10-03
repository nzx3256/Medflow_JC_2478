import { createContext, useContext, useState } from "react";

export const PageContext = createContext(null);

export function PageProvider({ children, frontPage }) {
    const [refreshKey, setRefreshKey] = useState(0);
    const [screen, setScreen] = useState(frontPage);
    const triggerRefresh = () => {
        setRefreshKey((prev) => ((prev + 1) % Number.MAX_SAFE_INTEGER));
    }
    const values = { screen, setScreen, frontPage, refreshKey, triggerRefresh };
    return <PageContext.Provider value={values}>{children}</PageContext.Provider>;
}

export function usePage() {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error("usePage() must be wrapped in a PageContextProvider");
    }
    return context;
}
