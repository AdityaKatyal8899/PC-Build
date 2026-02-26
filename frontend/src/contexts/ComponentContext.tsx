
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for backend data (as per user description)
// Expected response shape: { cpus: [], gpus: [], rams: [], motherboards: [], psus: [] }
// We need to verify the exact shape of the items in these arrays from the backend response or assumptions.
// The user said: "Expected response shape: { "cpus": [...], ... }"
// We need to transform them to { value: id, label: display_name, ...otherProps }

export interface ComponentItem {
    id: string;
    name: string;
    price: number;
    type: string;
    // Add other properties as needed based on actual backend response
    [key: string]: any;
}

export interface NormalizedComponentOption {
    value: string;
    label: string;
    priceUSD: number;
    priceINR: number; // We might need to calculate this if backend doesn't provide it
    original: ComponentItem;
}

export interface ComponentData {
    cpus: NormalizedComponentOption[];
    gpus: NormalizedComponentOption[];
    rams: NormalizedComponentOption[];
    motherboards: NormalizedComponentOption[];
    psus: NormalizedComponentOption[];
}

interface ComponentContextType {
    components: ComponentData;
    isLoading: boolean;
    error: string | null;
}

const ComponentContext = createContext<ComponentContextType | undefined>(undefined);

export function ComponentProvider({ children }: { children: ReactNode }) {
    const [components, setComponents] = useState<ComponentData>({
        cpus: [],
        gpus: [],
        rams: [],
        motherboards: [],
        psus: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/components');
                if (!response.ok) {
                    throw new Error('Failed to fetch components');
                }
                const data = await response.json();

                // Normalize data
                // The user said: "Examples: CPU -> brand + model"
                // We might need to adjust normalization based on actual fields.
                // For now, assuming standard fields like 'id', 'name', 'price'.
                // If the backend returns lists of objects, we map them.

                const normalize = (items: any[]): NormalizedComponentOption[] => {
                    if (!Array.isArray(items)) return [];
                    return items.map(item => ({
                        value: String(item.id || item.model || item.name), // Ensure string
                        label: item.name || `${item.brand} ${item.model || ''}`.trim() || 'Unknown Component',
                        priceUSD: item.msrp_usd || item.current_price || item.price || 0,
                        priceINR: item.current_price_inr || item.current_price || item.price || 0,
                        original: item
                    }));
                };

                setComponents({
                    cpus: normalize(data.cpus),
                    gpus: normalize(data.gpus),
                    rams: normalize(data.rams),
                    motherboards: normalize(data.motherboards),
                    psus: normalize(data.psus),
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching components:', err);
                setError('Failed to load components');
                // Keep empty arrays on error as requested
            } finally {
                setIsLoading(false);
            }
        };

        fetchComponents();
    }, []);

    return (
        <ComponentContext.Provider value={{ components, isLoading, error }}>
            {children}
        </ComponentContext.Provider>
    );
}

export function useComponents() {
    const context = useContext(ComponentContext);
    if (context === undefined) {
        throw new Error('useComponents must be used within a ComponentProvider');
    }
    return context;
}
