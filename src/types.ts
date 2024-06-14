export type Tenant = {
    id: number;
    name: string;
    address: string;
};

export type CreateTenantData = { name: string; address: string };

export type Credentials = {
    email: string;
    password: string;
};

export type UserData = {
    id: string;
    email: string;
    createdAt: string;
    firstName: string;
    lastName: string;
    tenant: Tenant | null;
};

export type CreateUserData = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId: number;
};

export type FieldData = {
    name: string[];
    value?: string;
};
