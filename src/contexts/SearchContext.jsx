import { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchTag, setSearchTag] = useState("");
    return (
        <SearchContext.Provider value={{ searchTag, setSearchTag }}>
            {children}
        </SearchContext.Provider>
    );
};
