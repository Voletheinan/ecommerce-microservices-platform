(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/contexts/cart-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CartProvider({ children }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const addToCart = (product, quantity = 1)=>{
        setItems((prev)=>{
            const existing = prev.find((item)=>item.product.id === product.id);
            if (existing) {
                return prev.map((item)=>item.product.id === product.id ? {
                        ...item,
                        quantity: item.quantity + quantity
                    } : item);
            }
            return [
                ...prev,
                {
                    product,
                    quantity
                }
            ];
        });
    };
    const removeFromCart = (productId)=>{
        setItems((prev)=>prev.filter((item)=>item.product.id !== productId));
    };
    const updateQuantity = (productId, quantity)=>{
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prev)=>prev.map((item)=>item.product.id === productId ? {
                    ...item,
                    quantity
                } : item));
    };
    const clearCart = ()=>setItems([]);
    const totalItems = items.reduce((sum, item)=>sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item)=>sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            subtotal,
            tax,
            total
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/cart-context.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "6WAym07vHedVzpAy8bFDJKqtv8I=");
_c = CartProvider;
function useCart() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// API configuration - using direct service calls for now
// Services: user-service:8001, product-service:8002, favourite-service:8010, etc.
const getServiceUrl = (path)=>{
    // Map API paths to direct service URLs
    if (path.startsWith('/api/users')) {
        return 'http://localhost:8001';
    }
    if (path.startsWith('/api/products')) {
        return 'http://localhost:8002';
    }
    if (path.startsWith('/api/favourites')) {
        return 'http://localhost:8010';
    }
    if (path.startsWith('/api/orders')) {
        return 'http://localhost:8003';
    }
    // Default to API Gateway if available
    return 'http://localhost:80';
};
const API_BASE_URL = 'http://localhost:80'; // Will be overridden by getServiceUrl
// Create axios instance with dynamic base URL
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Request interceptor: set base URL and add auth token
api.interceptors.request.use((config)=>{
    // Get service URL based on path
    const serviceUrl = getServiceUrl(config.url || '');
    if (serviceUrl !== API_BASE_URL) {
        config.baseURL = serviceUrl;
    }
    // Add auth token
    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('token') : "TURBOPACK unreachable";
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor for error handling
api.interceptors.response.use((response)=>response, (error)=>{
    if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/services/favourite.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "favouriteService",
    ()=>favouriteService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
const favouriteService = {
    // Get all favourites
    async getFavourites () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/api/favourites');
        return response.data;
    },
    // Add to favourites
    async addFavourite (productId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/api/favourites', {
            productId
        });
        return response.data;
    },
    // Remove from favourites
    async removeFavourite (productId) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/api/favourites/${productId}`);
    },
    // Check if product is favourite
    async isFavourite (productId) {
        try {
            const favourites = await this.getFavourites();
            return favourites.some((fav)=>fav.productId === productId);
        } catch  {
            return false;
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/favourites-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FavouritesProvider",
    ()=>FavouritesProvider,
    "useFavourites",
    ()=>useFavourites
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$favourite$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/favourite.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const FavouritesContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function FavouritesProvider({ children }) {
    _s();
    const [favourites, setFavourites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FavouritesProvider.useEffect": ()=>{
            const loadFavourites = {
                "FavouritesProvider.useEffect.loadFavourites": async ()=>{
                    try {
                        setLoading(true);
                        const favouritesData = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$favourite$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["favouriteService"].getFavourites();
                        const products = favouritesData.map({
                            "FavouritesProvider.useEffect.loadFavourites.products": (fav)=>fav.product
                        }["FavouritesProvider.useEffect.loadFavourites.products"]);
                        setFavourites(products);
                    } catch (error) {
                        console.error('Error loading favourites:', error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["FavouritesProvider.useEffect.loadFavourites"];
            loadFavourites();
        }
    }["FavouritesProvider.useEffect"], []);
    const addToFavourites = async (product)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$favourite$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["favouriteService"].addFavourite(product.id);
            setFavourites((prev)=>{
                if (prev.find((p)=>p.id === product.id)) return prev;
                return [
                    ...prev,
                    product
                ];
            });
        } catch (error) {
            console.error('Error adding to favourites:', error);
            throw error;
        }
    };
    const removeFromFavourites = async (productId)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$favourite$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["favouriteService"].removeFavourite(productId);
            setFavourites((prev)=>prev.filter((p)=>p.id !== productId));
        } catch (error) {
            console.error('Error removing from favourites:', error);
            throw error;
        }
    };
    const clearFavourites = async ()=>{
        try {
            // Remove all favourites one by one
            const productIds = favourites.map((p)=>p.id);
            await Promise.all(productIds.map((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$favourite$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["favouriteService"].removeFavourite(id)));
            setFavourites([]);
        } catch (error) {
            console.error('Error clearing favourites:', error);
            throw error;
        }
    };
    const isFavourite = (productId)=>{
        return favourites.some((p)=>p.id === productId);
    };
    const totalFavourites = favourites.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FavouritesContext.Provider, {
        value: {
            favourites,
            addToFavourites,
            removeFromFavourites,
            clearFavourites,
            isFavourite,
            totalFavourites,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/favourites-context.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_s(FavouritesProvider, "jRXkJvPaKRfguJ0yVoaOc4EJDGE=");
_c = FavouritesProvider;
function useFavourites() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(FavouritesContext);
    if (!context) {
        throw new Error("useFavourites must be used within a FavouritesProvider");
    }
    return context;
}
_s1(useFavourites, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "FavouritesProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/services/user.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userService",
    ()=>userService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
const userService = {
    // Login user
    async login (data) {
        // Backend accepts username or email, so we send email as username
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/api/users/login', {
            username: data.email,
            password: data.password
        });
        // Transform response to match frontend expectations
        return {
            token: response.data.access_token || response.data.token,
            user: {
                id: String(response.data.user?.id || response.data.user_id),
                username: response.data.user?.username || data.email.split('@')[0],
                email: response.data.user?.email || response.data.email,
                phone: response.data.user?.phone,
                address: response.data.user?.address
            }
        };
    },
    // Register user
    async register (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/api/users/register', data);
        return response.data;
    },
    // Get current user
    async getCurrentUser () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/api/users/me');
        return response.data;
    },
    // Update user profile
    async updateProfile (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put('/api/users/me', data);
        return response.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$user$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/user.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load user from token on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const loadUser = {
                "AuthProvider.useEffect.loadUser": async ()=>{
                    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('token') : "TURBOPACK unreachable";
                    if (token) {
                        try {
                            const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$user$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].getCurrentUser();
                            setUser(userData);
                        } catch (error) {
                            // Token invalid, clear it
                            localStorage.removeItem('token');
                        }
                    }
                    setLoading(false);
                }
            }["AuthProvider.useEffect.loadUser"];
            loadUser();
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$user$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].login({
                email,
                password
            });
            localStorage.setItem('token', response.token);
            setUser(response.user);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };
    const register = async (email, username, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$user$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].register({
                email,
                username,
                password
            });
            localStorage.setItem('token', response.token);
            setUser(response.user);
            return true;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        }
    };
    const logout = ()=>{
        localStorage.removeItem('token');
        setUser(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/auth-context.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_92d23a9d._.js.map