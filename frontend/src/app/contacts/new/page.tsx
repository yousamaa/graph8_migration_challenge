// src/app/contacts/new/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContactForm, { ContactFormData } from "@/components/forms/ContactForm";
import LoadingButton from "@/components/shared/LoadingButton";
import { createContact, fetchOrganizations, Organization } from "@/lib/api";

export default function NewContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ContactFormData>>({});
  const [organizations, setOrganizations] = useState<
    Pick<Organization, "id" | "name">[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOrgs, setIsFetchingOrgs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch organizations for the dropdown
  useEffect(() => {
    setIsFetchingOrgs(true);
    fetchOrganizations() // Fetch only active orgs by default
      .then((data) => {
        setOrganizations(data.map((org) => ({ id: org.id, name: org.name }))); // Extract only needed fields
      })
      .catch((err) => {
        console.error("Failed to fetch organizations:", err);
        setError("Failed to load organizations for dropdown.");
        // Handle error appropriately, maybe disable the form or show a message
      })
      .finally(() => {
        setIsFetchingOrgs(false);
      });
  }, []); // Run only once on mount

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value, // Handle empty string for nullable fields like organization_id
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.first_name || !formData.last_name) {
        throw new Error("First name and last name are required.");
      }
      await createContact(formData as ContactFormData); // Assert type assuming required fields are present
      // Add success message/toast here if desired
      router.push("/contacts"); // Redirect after successful creation
    } catch (err: any) {
      console.error("Failed to create contact:", err);
      setError(err.message || "Failed to create contact.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Create Contact</title>
      </Head>
      <h1 className="mb-8 text-3xl font-bold">
        <Link
          href="/contacts"
          className="text-indigo-500 hover:text-indigo-800"
        >
          Contacts
        </Link>
        <span className="font-medium text-indigo-400"> /</span> Create
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="max-w-3xl overflow-hidden rounded-sm bg-white shadow-sm">
        {isFetchingOrgs ? (
          <div className="p-8 text-center">Loading organization data...</div>
        ) : (
          <ContactForm
            formData={formData}
            organizations={organizations}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
          >
            {/* Actions Slot */}
            <div className="flex items-center justify-end border-t border-gray-200 bg-gray-100 px-8 py-4">
              <LoadingButton
                loading={isLoading}
                className="btn-indigo"
                type="submit"
              >
                Create Contact
              </LoadingButton>
            </div>
          </ContactForm>
        )}
      </div>
    </div>
  );
}
