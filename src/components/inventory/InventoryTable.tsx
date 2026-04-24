import { Edit2, Trash2 } from "lucide-react";
import { Inventory } from "../../types";
import { ActionMenu } from "../ui/ActionMenu";
import { Pagination } from "../ui/Pagination";
import { InventorySkeleton } from "./InventorySkeleton";


interface InventoryTableProps {
    items: Inventory[];
    loading?: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (item: Inventory) => void;
    onDelete: (item: Inventory) => void;
}

export function InventoryTable({
    items,
    loading,
    currentPage,
    totalPages,
    onPageChange,
    onEdit, 
    onDelete
}: InventoryTableProps) {

    const getStatus = (item: Inventory) => {
        if (item.quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
        if (item.quantity < item.minStock) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
        return { label: "In Stock", color: "bg-green-100 text-green-700" };
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Actions
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {loading ? (
                    <InventorySkeleton rows={5} />
                ) : items.length === 0 ? (
                    <tr>
                    <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                        No items match your filters
                    </td>
                    </tr>
                ) : (
                    items.map((item) => {
                    const status = getStatus(item);
                    return (
                        <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 capitalize">
                            {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                            {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                            >
                            {status.label}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <ActionMenu
                            items={[
                                {
                                label: "Edit Item",
                                icon: Edit2,
                                onClick: () => {
                                    onEdit(item)
                                },
                                },
                                {
                                label: "Delete Item",
                                icon: Trash2,
                                onClick: () => onDelete(item),
                                variant: "danger",
                                },
                            ]}
                            ariaLabel={`Actions for ${item.name}`}
                            />
                        </td>
                        </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>

        {!loading && items.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm bg-gray-50/50">

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
            </div>
        )}
        </div>
    )
}