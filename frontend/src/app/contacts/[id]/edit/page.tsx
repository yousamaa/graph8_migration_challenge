// src/app/contacts/[id]/edit/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ContactForm, { ContactFormData } from "@/components/forms/ContactForm";
import LoadingButton from "@/components/shared/LoadingButton";
import TrashedMessage from "@/components/shared/TrashedMessage";
import {
  fetchContact,
  fetchOrganizations,
  updateContact,
  deleteContact,
  restoreContact,
  Contact,
  Organization,
} from "@/lib/api";

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Partial<ContactFormData>>({});
  const [organizations, setOrganizations] = useState<
    Pick<Organization, "id" | "name">[]
  >([]);
  const [isLoading, setIsLoading] = useState(true); // Loading for initial fetches
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading for actions
  const [error, setError] = useState<string | null>(null);

  // Fetch contact data and organizations list
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetchContact(id),
      fetchOrganizations(), // Fetch orgs for the dropdown
    ])
      .then(([contactData, orgData]) => {
        setContact(contactData);
        // Populate form data, ensuring organization_id is set correctly
        const {
          id: _,
          deleted_at: __,
          organization: ___,
          ...contactFormValues
        } = contactData;
        // Explicitly set organization_id which might not be directly on the contact root level
        const initialFormData = {
          ...contactFormValues,
          organization_id: contactData.organization_id,
        };
        setFormData(initialFormData);

        setOrganizations(
          orgData.map((org) => ({ id: org.id, name: org.name }))
        );
      })
      .catch((err) => {
        console.error("Failed to fetch contact data or organizations:", err);
        setError(err.message || "Failed to load contact data.");
        // Consider specific error handling for contact vs orgs fetch
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : value, // Handle empty string for nullable fields
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contact) return;
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.first_name || !formData.last_name)
        throw new Error("First and Last name are required.");
      const updatedContact = await updateContact(
        contact.id,
        formData as ContactFormData
      );
      setContact(updatedContact);
      // Update form data from response
      const {
        id: _,
        deleted_at: __,
        organization: ___,
        ...contactFormValues
      } = updatedContact;
      const updatedFormData = {
        ...contactFormValues,
        organization_id: updatedContact.organization_id,
      };
      setFormData(updatedFormData);
      alert("Contact updated successfully!"); // Replace with toast
    } catch (err: any) {
      console.error("Failed to update contact:", err);
      setError(err.message || "Failed to update contact.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setIsSubmitting(true);
      setError(null);
      try {
        await deleteContact(contact.id);
        router.push("/contacts"); // Redirect after delete
      } catch (err: any) {
        console.error("Failed to delete contact:", err);
        setError(err.message || "Failed to delete contact.");
        setIsSubmitting(false);
      }
    }
  };

  const handleRestore = async () => {
    if (!contact) return;
    if (window.confirm("Are you sure you want to restore this contact?")) {
      setIsSubmitting(true);
      setError(null);
      try {
        await restoreContact(contact.id);
        // Refetch data to update state
        const refreshedContact = await fetchContact(contact.id);
        setContact(refreshedContact);
        const {
          id: _,
          deleted_at: __,
          organization: ___,
          ...contactFormValues
        } = refreshedContact;
        const refreshedFormData = {
          ...contactFormValues,
          organization_id: refreshedContact.organization_id,
        };
        setFormData(refreshedFormData);
        alert("Contact restored successfully!"); // Replace with toast
      } catch (err: any) {
        console.error("Failed to restore contact:", err);
        setError(err.message || "Failed to restore contact.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading contact data...</div>;
  }

  if (error && !contact) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!contact) {
    return <div className="p-4">Contact not found.</div>;
  }

  const contactName = `${formData.first_name || ""} ${
    formData.last_name || ""
  }`.trim();

  return (
    <div>
      <Head>
        <title>{contactName || "Edit Contact"}</title>
      </Head>
      <h1 className="mb-8 text-3xl font-bold">
        <Link
          href="/contacts"
          className="text-indigo-500 hover:text-indigo-800"
        >
          Contacts
        </Link>
        <span className="font-medium text-indigo-400"> /</span> {contactName}
      </h1>

      {contact.deleted_at && (
        <TrashedMessage onRestore={handleRestore} className="mb-6">
          This contact has been deleted.
        </TrashedMessage>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="max-w-3xl overflow-hidden rounded-sm bg-white shadow-sm">
        <ContactForm
          formData={formData}
          organizations={organizations}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
        >
          {/* Actions Slot */}
          <div className="flex items-center border-t border-gray-200 bg-gray-100 px-8 py-4">
            {!contact.deleted_at && (
              <button
                type="button"
                className="text-red-700 hover:underline disabled:opacity-50"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete Contact
              </button>
            )}
            <LoadingButton
              loading={isSubmitting}
              className="btn-indigo ml-auto"
              type="submit"
              disabled={contact.deleted_at != null}
            >
              Update Contact
            </LoadingButton>
          </div>
        </ContactForm>
      </div>
    </div>
  );
}
