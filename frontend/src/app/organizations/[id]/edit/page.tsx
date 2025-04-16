// app/organizations/[id]/edit/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import OrganizationForm, {
  OrganizationFormData,
} from "@/components/forms/OrganizationForm";
import LoadingButton from "@/components/shared/LoadingButton";
import TrashedMessage from "@/components/shared/TrashedMessage";
import {
  fetchOrganization,
  updateOrganization,
  deleteOrganization,
  restoreOrganization,
  Organization,
  // fetchContacts, // If needed for displaying contacts
  // Contact
} from "@/lib/api";
import Icon from "@/components/shared/Icon"; // If showing contacts table

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<Partial<OrganizationFormData>>({});
  // const [contacts, setContacts] = useState<Contact[]>([]); // State for related contacts
  const [isLoading, setIsLoading] = useState(true); // Loading for initial fetch
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading for form submit/delete/restore
  const [error, setError] = useState<string | null>(null);

  // Fetch organization data on mount
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    fetchOrganization(id)
      .then((data) => {
        setOrganization(data);
        // Populate form data from fetched organization
        const { id: _, deleted_at: __, ...orgData } = data;
        setFormData(orgData);

        // --- Fetch Related Contacts (Optional) ---
        // Need an API endpoint like /organizations/{id}/contacts or filter client-side
        // Example: Assuming filtering all contacts client-side (less efficient)
        // return fetchContacts(); // Fetch all contacts
        // })
        // .then(allContacts => {
        //    if (allContacts) {
        //        setContacts(allContacts.filter(c => c.organization_id === id));
        //    }
        // --- End Fetch Related Contacts ---
      })
      .catch((err) => {
        console.error("Failed to fetch organization:", err);
        setError(err.message || "Failed to load organization data.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organization) return;
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name) throw new Error("Name is required.");
      const updatedOrg = await updateOrganization(
        organization.id,
        formData as OrganizationFormData
      );
      setOrganization(updatedOrg); // Update local state with response
      // Update form data as well in case response differs slightly
      const { id: _, deleted_at: __, ...orgData } = updatedOrg;
      setFormData(orgData);
      // Add success message/toast here
      alert("Organization updated successfully!");
    } catch (err: any) {
      console.error("Failed to update organization:", err);
      setError(err.message || "Failed to update organization.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!organization) return;
    if (window.confirm("Are you sure you want to delete this organization?")) {
      setIsSubmitting(true);
      setError(null);
      try {
        await deleteOrganization(organization.id);
        // Add success message/toast
        router.push("/organizations"); // Redirect or refetch/update state to show trashed
      } catch (err: any) {
        console.error("Failed to delete organization:", err);
        setError(err.message || "Failed to delete organization.");
        setIsSubmitting(false);
      }
      // No finally needed if redirecting
    }
  };

  const handleRestore = async () => {
    if (!organization) return;
    if (window.confirm("Are you sure you want to restore this organization?")) {
      setIsSubmitting(true);
      setError(null);
      try {
        await restoreOrganization(organization.id);
        // Refetch data to update state
        const refreshedOrg = await fetchOrganization(organization.id);
        setOrganization(refreshedOrg);
        const { id: _, deleted_at: __, ...orgData } = refreshedOrg;
        setFormData(orgData);
        // Add success message/toast
        alert("Organization restored successfully!");
      } catch (err: any) {
        console.error("Failed to restore organization:", err);
        setError(err.message || "Failed to restore organization.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading organization data...</div>;
  }

  if (error && !organization) {
    // Show error only if loading failed completely
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!organization) {
    return <div className="p-4">Organization not found.</div>; // Should be caught by fetch error ideally
  }

  return (
    <div>
      <Head>
        <title>{formData.name || "Edit Organization"}</title>
      </Head>
      <h1 className="mb-8 text-3xl font-bold">
        <Link
          href="/organizations"
          className="text-indigo-500 hover:text-indigo-800"
        >
          Organizations
        </Link>
        <span className="font-medium text-indigo-400"> /</span> {formData.name}
      </h1>

      {organization.deleted_at && (
        <TrashedMessage onRestore={handleRestore} className="mb-6">
          This organization has been deleted.
        </TrashedMessage>
      )}

      {/* Display general errors (e.g., update/delete failed) */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="max-w-3xl overflow-hidden rounded-sm bg-white shadow-sm">
        <OrganizationForm
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
        >
          {/* Actions Slot */}
          <div className="flex items-center border-t border-gray-200 bg-gray-100 px-8 py-4">
            {!organization.deleted_at && (
              <button
                type="button"
                className="text-red-700 hover:underline disabled:opacity-50"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete Organization
              </button>
            )}
            <LoadingButton
              loading={isSubmitting}
              className="btn-indigo ml-auto"
              type="submit"
              disabled={organization.deleted_at != null} // Disable update if deleted
            >
              Update Organization
            </LoadingButton>
          </div>
        </OrganizationForm>
      </div>

      {/* --- Related Contacts Table (Optional) --- */}
      {/* <h2 className="mt-12 text-2xl font-bold">Contacts</h2>
            <div className="mt-6 overflow-x-auto rounded-sm bg-white shadow-sm">
                <table className="w-full whitespace-nowrap">
                     <thead>
                       <tr className="text-left font-bold">
                         <th className="px-6 pb-4 pt-6">Name</th>
                         <th className="px-6 pb-4 pt-6">City</th>
                         <th className="px-6 pb-4 pt-6" colSpan={2}>Phone</th>
                       </tr>
                     </thead>
                     <tbody>
                        {contacts.length > 0 ? contacts.map(contact => (
                            <tr key={contact.id} className="focus-within:bg-gray-100 hover:bg-gray-100">
                                <td className="border-t">
                                    <Link href={`/contacts/${contact.id}/edit`} className="flex items-center px-6 py-4 focus:text-indigo-500">
                                         {contact.first_name} {contact.last_name}
                                        {contact.deleted_at && <Icon name="trash" className="ml-2 h-3 w-3 shrink-0 fill-gray-500" />}
                                    </Link>
                                </td>
                                 <td className="border-t">
                                    <Link href={`/contacts/${contact.id}/edit`} className="flex items-center px-6 py-4" tabIndex={-1}>
                                        {contact.city || '-'}
                                    </Link>
                                 </td>
                                 <td className="border-t">
                                     <Link href={`/contacts/${contact.id}/edit`} className="flex items-center px-6 py-4" tabIndex={-1}>
                                        {contact.phone || '-'}
                                    </Link>
                                 </td>
                                 <td className="w-px border-t">
                                     <Link href={`/contacts/${contact.id}/edit`} className="flex items-center px-4" tabIndex={-1}>
                                         <Icon name="cheveron-right" className="block h-6 w-6 fill-gray-500" />
                                     </Link>
                                 </td>
                            </tr>
                        )) : (
                            <tr><td className="border-t px-6 py-4" colSpan={4}>No contacts found for this organization.</td></tr>
                        )}
                     </tbody>
                </table>
             </div> */}
      {/* --- End Related Contacts Table --- */}
    </div>
  );
}
