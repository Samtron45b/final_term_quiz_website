import { createContext } from "react";

const LocationContext = createContext({
    location: null,
    seLocation: (pathname) => pathname
});

export default LocationContext;
