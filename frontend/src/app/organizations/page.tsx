// app/organizations/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head"; // Use next/head for title
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Use App Router hooks
import Icon from "@/components/shared/Icon";
import SearchFilter from "@/components/shared/SearchFilter";
// import Modal from '@/components/shared/Modal'; // Import modal if using
// import NewOrganizationForm from '@/components/organizations/NewOrganizationForm'; // Form for modal
import { fetchOrganizations, Organization } from "@/lib/api"; // Import API functions and types
// import Pagination from '@/components/shared/Pagination'; // Import if pagination is implemented

export default function OrganizationsIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for data, filters, loading, and modal
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false); // For create modal

  // Read filters from URL query params
  const initialSearch = searchParams.get("search") || "";
  const initialTrashed =
    (searchParams.get("trashed") as "with" | "only" | null) || null;

  const [filters, setFilters] = useState({
    search: initialSearch,
    trashed: initialTrashed,
  });

  // Memoize API parameters to prevent unnecessary useEffect runs
  const apiParams = useMemo(
    () => ({
      search: filters.search || null,
      trashed: filters.trashed || null,
    }),
    [filters.search, filters.trashed]
  );

  // Fetch data when filters change
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchOrganizations(apiParams)
      .then((data) => {
        setOrganizations(data);
      })
      .catch((err) => {
        console.error("Failed to fetch organizations:", err);
        setError(err.message || "Failed to load organizations.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [apiParams]); // Depend only on the memoized params

  // Update URL when filters change (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.trashed) params.set("trashed", filters.trashed);
      // Use router.replace to avoid adding to history stack for filters
      router.replace(`/organizations?${params.toString()}`);
    }, 300); // Debounce time

    return () => clearTimeout(handler); // Cleanup timeout on unmount or filter change
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

  // Handler for successful creation from modal (if used)
  // const handleCreateSuccess = () => {
  //     setIsModalOpen(false);
  //     // Re-fetch data - trigger useEffect by slightly changing params if needed, or manually call fetch
  //     fetchOrganizations(apiParams).then(setOrganizations).catch(console.error);
  // };

  return (
    <div>
      <Head>
        <title>Organizations</title>
      </Head>
      <h1 className="mb-8 text-3xl font-bold">Organizations</h1>

      {/* Error Message */}
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
        >
          {/* Trashed Filter Dropdown */}
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
              <option value="">Active</option> {/* Default: not trashed */}
              <option value="with">With Trashed</option>
              <option value="only">Only Trashed</option>
            </select>
          </div>
        </SearchFilter>

        {/* Use Link for navigation to the dedicated 'new' page */}
        <Link href="/organizations/new" className="btn-indigo">
          Create <span className="hidden md:inline">Organization</span>
        </Link>

        {/* OR: Button to open modal (if using modal approach) */}
        {/* <button className="btn-indigo" onClick={() => setIsModalOpen(true)}>
                    Create <span className="hidden md:inline">Organization</span>
                </button> */}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-sm bg-white shadow-sm">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-left font-bold">
              <th className="px-6 pb-4 pt-6">Name</th>
              <th className="px-6 pb-4 pt-6">City</th>
              <th className="px-6 pb-4 pt-6" colSpan={2}>
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="border-t px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : organizations.length > 0 ? (
              organizations.map((organization) => (
                <tr
                  key={organization.id}
                  className="focus-within:bg-gray-100 hover:bg-gray-100"
                >
                  <td className="border-t">
                    <Link
                      href={`/organizations/${organization.id}/edit`}
                      className="flex items-center px-6 py-4 focus:text-indigo-500"
                    >
                      {organization.name}
                      {organization.deleted_at && (
                        <Icon
                          name="trash"
                          className="ml-2 h-3 w-3 shrink-0 fill-gray-500"
                        />
                      )}
                    </Link>
                  </td>
                  <td className="border-t">
                    <Link
                      href={`/organizations/${organization.id}/edit`}
                      className="flex items-center px-6 py-4"
                      tabIndex={-1}
                      aria-label="Edit"
                    >
                      {organization.city || "-"}
                    </Link>
                  </td>
                  <td className="border-t">
                    <Link
                      href={`/organizations/${organization.id}/edit`}
                      className="flex items-center px-6 py-4"
                      tabIndex={-1}
                      aria-label="Edit"
                    >
                      {organization.phone || "-"}
                    </Link>
                  </td>
                  <td className="w-px border-t">
                    <Link
                      href={`/organizations/${organization.id}/edit`}
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
                <td className="border-t px-6 py-4" colSpan={4}>
                  No organizations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Component - Add if API supports pagination and component is built */}
      {/* <Pagination meta={...} /> */}

      {/* Modal for Creating (if using modal approach) */}
      {/* <Modal open={isModalOpen} title="Create Organization" onClose={() => setIsModalOpen(false)}>
                 <NewOrganizationForm onSuccess={handleCreateSuccess} />
            </Modal> */}
    </div>
  );
}
