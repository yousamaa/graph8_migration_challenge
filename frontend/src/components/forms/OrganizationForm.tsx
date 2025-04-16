// components/forms/OrganizationForm.tsx
import React from "react";
import TextInput from "@/components/shared/TextInput";
import SelectInput from "@/components/shared/SelectInput";
import { Organization } from "@/lib/api"; // Import type

// Define the shape of the form data (excluding fields set by backend)
export type OrganizationFormData = Omit<Organization, "id" | "deleted_at">;

interface OrganizationFormProps {
  formData: Partial<OrganizationFormData>; // Use Partial for create form
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  // Pass errors if you have form validation library or state
  // errors?: Record<string, string | string[]>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode; // For action buttons slot
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  formData,
  onFormChange,
  // errors = {},
  onSubmit,
  children,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="-mb-8 -mr-6 flex flex-wrap p-8">
        <TextInput
          label="Name"
          name="name"
          value={formData.name || ""}
          onChange={onFormChange}
          // errors={errors.name}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
          required // Example: Add HTML5 validation
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={onFormChange}
          // errors={errors.email}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
        />
        <TextInput
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={onFormChange}
          // errors={errors.phone}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
        />
        <TextInput
          label="Address"
          name="address"
          value={formData.address || ""}
          onChange={onFormChange}
          // errors={errors.address}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
        />
        <TextInput
          label="City"
          name="city"
          value={formData.city || ""}
          onChange={onFormChange}
          // errors={errors.city}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
        />
        <TextInput
          label="Province/State"
          name="region"
          value={formData.region || ""}
          onChange={onFormChange}
          // errors={errors.region}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
        />
        <SelectInput
          label="Country"
          name="country"
          value={formData.country || ""}
          onChange={onFormChange}
          // errors={errors.country}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
        >
          <option value="">Select Country</option>
          <option value="CA">Canada</option>
          <option value="US">United States</option>
          {/* Add more countries as needed */}
        </SelectInput>
        <TextInput
          label="Postal Code"
          name="postal_code"
          value={formData.postal_code || ""}
          onChange={onFormChange}
          // errors={errors.postal_code}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
        />
      </div>
      {/* Slot for action buttons */}
      {children}
    </form>
  );
};

export default OrganizationForm;
