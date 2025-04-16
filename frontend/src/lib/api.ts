// lib/api.ts
const API_BASE_URL = 'https://graph8-migration-challenge.onrender.com';

// Type Definitions (basic examples, align with your FastAPI schemas)
export interface Organization {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
    postal_code?: string | null;
    deleted_at?: string | null;
    // Add other fields if needed
}

export interface Contact {
    id: string;
    first_name: string;
    last_name: string;
    organization_id?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
    postal_code?: string | null;
    deleted_at?: string | null;
    organization?: Pick<Organization, 'id' | 'name'> | null; // Include nested org if API returns it
}

interface ApiListParams {
    search?: string | null;
    trashed?: 'with' | 'only' | null;
}

async function fetchApi(path: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${path}`;
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Add Authorization headers if needed later
        },
        ...options,
    };

    try {
        const response = await fetch(url, defaultOptions);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
            console.error(`API Error (${response.status}): ${errorData.detail || response.statusText}`);
            throw new Error(errorData.detail || `Request failed with status ${response.status}`);
        }
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null; // Handle No Content responses
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch API Error:', error);
        throw error; // Re-throw to be caught by calling function
    }
}

// --- Organizations API ---

export async function fetchOrganizations(params: ApiListParams = {}): Promise<Organization[]> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.trashed) query.set('trashed', params.trashed);
    return fetchApi(`/organizations?${query.toString()}`);
}

export async function fetchOrganization(id: string): Promise<Organization> {
    // NOTE: The provided FastAPI code doesn't have a GET /organizations/{id} endpoint.
    // Assuming it exists or you fetch all and filter (less efficient).
    // For now, let's *assume* it exists based on standard REST patterns.
    // If not, you'll need to adjust fetching in the Edit component.
    // return fetchApi(`/organizations/${id}`);

    // Workaround: Fetch all and find by ID (inefficient for large datasets!)
    const allOrgs = await fetchOrganizations();
    const org = allOrgs.find(o => o.id === id);
    if (!org) throw new Error('Organization not found');
    return org;

    // Ideal scenario: Add a GET /organizations/{id} endpoint to FastAPI
}

export async function createOrganization(data: Omit<Organization, 'id' | 'deleted_at'>): Promise<Organization> {
    return fetchApi('/organizations', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateOrganization(id: string, data: Omit<Organization, 'id' | 'deleted_at'>): Promise<Organization> {
    return fetchApi(`/organizations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteOrganization(id: string): Promise<void> {
    await fetchApi(`/organizations/${id}`, { method: 'DELETE' });
}

export async function restoreOrganization(id: string): Promise<void> {
    await fetchApi(`/organizations/${id}/restore`, { method: 'PUT' });
}


// --- Contacts API ---

export async function fetchContacts(params: ApiListParams = {}): Promise<Contact[]> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.trashed) query.set('trashed', params.trashed);
     // FastAPI uses /contacts/ for list, not /contacts
    return fetchApi(`/contacts/?${query.toString()}`);
}

export async function fetchContact(id: string): Promise<Contact> {
    return fetchApi(`/contacts/${id}`);
}

export async function createContact(data: Omit<Contact, 'id' | 'deleted_at' | 'organization'>): Promise<Contact> {
     // FastAPI uses /contacts/ for create, not /contacts
    return fetchApi('/contacts/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateContact(id: string, data: Omit<Contact, 'id' | 'deleted_at' | 'organization'>): Promise<Contact> {
    return fetchApi(`/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteContact(id: string): Promise<void> {
    // FastAPI uses soft_delete_contact name, but path is correct
    await fetchApi(`/contacts/${id}`, { method: 'DELETE' });
}

export async function restoreContact(id: string): Promise<void> {
    await fetchApi(`/contacts/${id}/restore`, { method: 'PUT' });
}