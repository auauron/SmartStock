import React, { useState  } from "react";
import { Plus} from "lucide-react"
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import { DropdownField } from "../components/ui/DropdownField";
import { TextAreaField } from "../components/ui/TextAreaField";
import { useRestocks } from "../hooks/useRestocks";

export function Restock() {
    const {
        history,
        products,
        loading,
        submitting,
        error,
        addRestock,
        clearError,
    } = useRestocks();

    const [formData, setFormData] = useState({
        productId: "",
        quantity: "",
        notes: "",
    });
    const [formKey, setFormKey ] = useState(0);

    const handleSubmit = async(e: React.FormEvent) => { 
        e.preventDefault();   

        const quantityValue = Number.parseInt(formData.quantity, 10);
        if (
            !formData.productId || 
            Number.isNaN(quantityValue) ||
            quantityValue < 1
        ) {
            return;
        }
        
        try {
            await addRestock({
                productId: formData.productId,
                quantityAdded: quantityValue,
                notes: formData.notes,
            });
            setFormData({ productId: "", quantity: "", notes: ""})
            setFormKey((k) => k + 1)
        } catch { 

        }
    }

return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-semibold text-gray-900"> Restock Management</h1>
            <p className="text-gray-600 mt-1">
                Add new stock and track restock history
            </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibvold text-gray-900 mb-4">
                Add restock
            </h2>
            {error ? (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <div className="flex items-center justify-between gap-3">
                        <span>{error}</span>
                        <button
                        type="button"
                        onClick = {clearError}
                        className="text-red-600 hover:text-red-800"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            ) : null}
            <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DropdownField
                        required
                        label="Product Name"
                        value={formData.productId}
                        onChange={(e) =>
                            setFormData({ ...formData, productId: e.target.value})
                        }
                        disabled={loading || submitting || products.length == 0}
                        className="py-2"
                        >
                            {loading ? (
                                <option value="">Loading products... </option>
                            ) : products.length === 0 ? (
                                <option value="">No products available</option>
                            ) : (
                                <option value="" disabled>
                                    Select a product
                                </option>
                            )}
                            {products.map((product) =>
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                                )}
                        </DropdownField>
                        
                        <InputField
                        type="number"
                        label="Restock Quantity"
                        placeholder="Enter Quantity"
                        min='1'
                        value={formData.quantity}
                        onChange={(e) => 
                            setFormData({...formData, quantity: e.target.value})
                        }
                        disabled={submitting}
                        className="py-2"
                        />
                </div>

                <TextAreaField
                    label="Notes (Optional)"
                    value={formData.notes}
                    onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value})
                    }
                    disabled={submitting}
                    rows={3}
                    className="resize-none"
                    placeholder="Add any notes about this restock..."
                />

                <Button
                    type="submit"
                    disabled={submitting || loading}
                   ><Plus className="w-5 h-5" />
                    {submitting ? "Adding..." : "Add Restock Entry"}
                </Button>
            </form>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-grayt-200">
                    Restock History
                </h2>
                <p className="test-sm text-gray-600 mt-1">
                    Recent restocking activities
                </p>
            </div>

        {loading? (
            <div 
            className="flext items-center justify-center gap-3 py-12"
            role="status"
            aria-live="polite"
            >
                <span 
                className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600"
                area-hidden="true"
                />
                <p className="text-gray-500">Loading restock history...</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Quantity Added</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-299">
                        {history.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-medium text-gray-900">
                                        {entry.productName}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                        +{entry.quantityAdded} units
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {new Date(entry.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {entry.notes || (
                                        <span className="text-gray-400 italic">No notes</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             )}

             {!loading && history.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No restock history available</p>
                </div>
             )}
        </div>
    </div>
)}
