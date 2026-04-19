import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { InputField } from "../ui/InputField";
import { DropdownField } from "../ui/DropdownField";
import { TextAreaField } from "../ui/TextAreaField";
import type { RestockInventoryOption } from "../../types";

export interface RestockFormData {
  inventoryId: string;
  quantity: string;
  notes: string;
}

interface RestockAddFormProps {
  formKey: number;
  formData: RestockFormData;
  inventory: RestockInventoryOption[];
  loading: boolean;
  submitting: boolean;
  errorMessage: string;
  onDismissError: () => void;
  onInventoryChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function RestockAddForm({
  formKey,
  formData,
  inventory,
  loading,
  submitting,
  errorMessage,
  onDismissError,
  onInventoryChange,
  onQuantityChange,
  onNotesChange,
  onSubmit,
}: RestockAddFormProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Restock</h2>
      {errorMessage ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <div className="flex items-center justify-between gap-3">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={onDismissError}
              className="text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <form key={formKey} onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropdownField
            id="restock-item-select"
            required
            searchable
            label="Item Name"
            value={formData.inventoryId}
            onChange={(e) => onInventoryChange(e.target.value)}
            disabled={loading || submitting || inventory.length === 0}
            className="py-2"
          >
            {loading ? (
              <option value="">Loading items...</option>
            ) : inventory.length === 0 ? (
              <option value="">No items available</option>
            ) : (
              <option value="" disabled>
                Select an item
              </option>
            )}

            {inventory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </DropdownField>

          <InputField
            id="restock-quantity"
            type="number"
            label="Restock Quantity"
            placeholder="Enter Quantity"
            min="1"
            value={formData.quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            disabled={submitting}
            className="py-2"
          />
        </div>

        <TextAreaField
          id="restock-notes"
          label="Notes (Optional)"
          value={formData.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          disabled={submitting}
          rows={3}
          className="resize-none"
          placeholder="Add any notes about this restock..."
        />

        <Button type="submit" disabled={submitting || loading}>
          <Plus className="w-5 h-5" />
          {submitting ? "Adding..." : "Add Restock Entry"}
        </Button>
      </form>
    </div>
  );
}
