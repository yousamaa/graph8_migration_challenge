// components/forms/ContactForm.tsx
import React from "react";
import TextInput from "@/components/shared/TextInput";
import SelectInput from "@/components/shared/SelectInput";
import { Contact, Organization } from "@/lib/api";

export type ContactFormData = Omit<
  Contact,
  "id" | "deleted_at" | "organization"
> & {
  // Ensure organization_id is part of the form data for submission
  organization_id?: string | null;
};

interface ContactFormProps {
  formData: Partial<ContactFormData>;
  organizations: Pick<Organization, "id" | "name">[]; // List of orgs for dropdown
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  // errors?: Record<string, string | string[]>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode; // Action buttons slot
}

const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  organizations,
  onFormChange,
  // errors = {},
  onSubmit,
  children,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="-mb-8 -mr-6 flex flex-wrap p-8">
        <TextInput
          label="First Name"
          name="first_name"
          value={formData.first_name || ""}
          onChange={onFormChange}
          // errors={errors.first_name}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
          required
        />
        <TextInput
          label="Last Name"
          name="last_name"
          value={formData.last_name || ""}
          onChange={onFormChange}
          // errors={errors.last_name}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
          required
        />
        <SelectInput
          label="Organization"
          name="organization_id" // Ensure this matches the field name expected by API
          value={formData.organization_id || ""} // Use organization_id
          onChange={onFormChange}
          // errors={errors.organization_id}
          wrapperClassName="w-full pb-8 pr-6 lg:w-1/2"
        >
          <option value="">Select Organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </SelectInput>
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
      {children}
    </form>
  );
};

export default ContactForm;
