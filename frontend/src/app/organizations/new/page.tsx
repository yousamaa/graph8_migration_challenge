// app/organizations/new/page.tsx
"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrganizationForm, {
  OrganizationFormData,
} from "@/components/forms/OrganizationForm";
import LoadingButton from "@/components/shared/LoadingButton";
import { createOrganization } from "@/lib/api";

export default function NewOrganizationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<OrganizationFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Basic validation check (ensure name exists)
      if (!formData.name) {
        throw new Error("Name is required.");
      }
      await createOrganization(formData as OrganizationFormData); // Type assertion assumes required fields are filled
      // Add success message/toast here if desired
      router.push("/organizations"); // Redirect after successful creation
    } catch (err: any) {
      console.error("Failed to create organization:", err);
      setError(err.message || "Failed to create organization.");
      setIsLoading(false); // Keep loading false on error
    }
    // No finally block needed for loading state if redirecting on success
  };

  return (
    <div>
      <Head>
        <title>Create Organization</title>
      </Head>
      <h1 className="mb-8 text-3xl font-bold">
        <Link
          href="/organizations"
          className="text-indigo-500 hover:text-indigo-800"
        >
          Organizations
        </Link>
        <span className="font-medium text-indigo-400"> /</span> Create
      </h1>

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
          <div className="flex items-center justify-end border-t border-gray-200 bg-gray-100 px-8 py-4">
            <LoadingButton
              loading={isLoading}
              className="btn-indigo"
              type="submit"
            >
              Create Organization
            </LoadingButton>
          </div>
        </OrganizationForm>
      </div>
    </div>
  );
}
