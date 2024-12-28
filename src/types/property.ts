export interface Property {
    _id: string;
    id?: string;
    title: string;
    description: string;
    price: number;
    area: number;
    location: {
        city: string;
        district: string;
        address: string;
        coordinates?: {
            lat: number;
            lng: number;
        }
    };
    features: {
        zoning: string;
        parcelNo?: string;
        blockNo?: string;
        [key: string]: string | undefined;
    };
    images: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PropertyFormData extends Omit<Property, '_id' | 'createdAt' | 'updatedAt'> {} 