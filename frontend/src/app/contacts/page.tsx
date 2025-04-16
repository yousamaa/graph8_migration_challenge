// src/app/contacts/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/shared/Icon";
import SearchFilter from "@/components/shared/SearchFilter";
import { fetchContacts, Contact, Organization } from "@/lib/api"; // Import API functions and types
// import Pagination from '@/components/shared/Pagination'; // Import if pagination is implemented

// Helper to safely access nested organization name
const getOrganizationName = (contact: Contact): string => {
  // The API might return organization directly nested, or just an ID.
  // Adjust based on your actual API response structure for the list endpoint.
  // Assuming the list endpoint includes a nested 'organization' object with 'name'.
  // If not, you might need another fetch or adjust the API.
  return contact.organization?.name || "-";
};

export default function ContactsIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialSearch = searchParams.get("search") || "";
  const initialTrashed =
    (searchParams.get("trashed") as "with" | "only" | null) || null;

  const [filters, setFilters] = useState({
    search: initialSearch,
    trashed: initialTrashed,
  });

  const apiParams = useMemo(
    () => ({
      search: filters.search || null,
      trashed: filters.trashed || null,
    }),
    [filters.search, filters.trashed]
  );

  // Fetch data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchContacts(apiParams)
      .then((data) => {
        setContacts(data);
      })
      .catch((err) => {
        console.error("Failed to fetch contacts:", err);
        setError(err.message || "Failed to load contacts.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [apiParams]);

  // Update URL (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.trashed) params.set("trashed", filters.trashed);
      router.replace(`/contacts?${params.toString()}`);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters, router]);

  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string | null) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setFilters({ search: "", trashed: null });
  }, []);

  return (
    <div>
      <Head>
        <title>Contacts</title>
      </Head>
      <h1 className="mb-8 text-3xl font-bold">Contacts</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <SearchFilter
          className="mr-4 w-full max-w-md"
          value={filters.search}
          onUpdateValue={(value) => handleFilterChange("search", value)}
          onReset={handleReset}
          placeholder="Search by name/email..."
        >
          <div className="flex items-center">
            <label
              className="block text-gray-800 text-sm mr-2 shrink-0"
              htmlFor="trashed-filter"
            >
              Trashed:
            </label>
            <select
              id="trashed-filter"
              value={filters.trashed ?? ""}
              onChange={(e) =>
                handleFilterChange(
                  "trashed",
                  (e.target.value as "with" | "only") || null
                )
              }
              className="form-select mt-1 block w-full text-sm"
            >
              <option value="">Active</option>
              <option value="with">With Trashed</option>
              <option value="only">Only Trashed</option>
            </select>
          </div>
        </SearchFilter>

        <Link href="/contacts/new" className="btn-indigo">
          Create <span className="hidden md:inline">Contact</span>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-sm bg-white shadow-sm">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-left font-bold">
              <th className="px-6 pb-4 pt-6">Name</th>
              <th className="px-6 pb-4 pt-6">Organization</th>
              <th className="px-6 pb-4 pt-6">City</th>
              <th className="px-6 pb-4 pt-6" colSpan={2}>
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="border-t px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="focus-within:bg-gray-100 hover:bg-gray-100"
                >
                  <td className="border-t">
                    <Link
                      href={`/contacts/${contact.id}/edit`}
                      className="flex items-center px-6 py-4 focus:text-indigo-500"
                    >
                      {contact.first_name} {contact.last_name}
                      {contact.deleted_at && (
                        <Icon
                          name="trash"
                          className="ml-2 h-3 w-3 shrink-0 fill-gray-500"
                        />
                      )}
                    </Link>
                  </td>
                  <td className="border-t">
                    <Link
                      href={`/contacts/${contact.id}/edit`}
                      className="flex items-center px-6 py-4"
                      tabIndex={-1}
                    >
                      {getOrganizationName(contact)}
                    </Link>
                  </td>
                  <td className="border-t">
                    <Link
                      href={`/contacts/${contact.id}/edit`}
                      className="flex items-center px-6 py-4"
                      tabIndex={-1}
                    >
                      {contact.city || "-"}
                    </Link>
                  </td>
                  <td className="border-t">
                    <Link
                      href={`/contacts/${contact.id}/edit`}
                      className="flex items-center px-6 py-4"
                      tabIndex={-1}
                    >
                      {contact.phone || "-"}
                    </Link>
                  </td>
                  <td className="w-px border-t">
                    <Link
                      href={`/contacts/${contact.id}/edit`}
                      className="flex items-center px-4"
                      tabIndex={-1}
                      aria-label="Edit"
                    >
                      <Icon
                        name="cheveron-right"
                        className="block h-6 w-6 fill-gray-500"
                      />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border-t px-6 py-4" colSpan={5}>
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <Pagination meta={...} /> */}
    </div>
  );
}
