import { useState } from "react";
import { Plus, Edit2, Trash2, RefreshCw, Search, Filter } from "lucide-react";
import { ProductModal, Product } from "../components/inventory/ProductModal";

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    category: "Electronics",
    price: 29.99,
    quantity: 8,
    minStock: 20,
  },
  {
    id: "2",
    name: "Office Chair",
    category: "Furniture",
    price: 249.99,
    quantity: 3,
    minStock: 10,
  },
  {
    id: "3",
    name: "USB Cable",
    category: "Electronics",
    price: 9.99,
    quantity: 15,
    minStock: 50,
  },
  {
    id: "4",
    name: "Laptop Stand",
    category: "Accessories",
    price: 49.99,
    quantity: 45,
    minStock: 20,
  },
  {
    id: "5",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 89.99,
    quantity: 32,
    minStock: 15,
  },
  {
    id: "6",
    name: "Notebook",
    category: "Stationery",
    price: 4.99,
    quantity: 12,
    minStock: 30,
  },
  {
    id: "7",
    name: 'Monitor 24"',
    category: "Electronics",
    price: 199.99,
    quantity: 18,
    minStock: 10,
  },
  {
    id: "8",
    name: "Desk Lamp",
    category: "Furniture",
    price: 34.99,
    quantity: 5,
    minStock: 15,
  },
  {
    id: "9",
    name: "Webcam HD",
    category: "Electronics",
    price: 79.99,
    quantity: 0,
    minStock: 12,
  },
  {
    id: "10",
    name: "Pen Set",
    category: "Stationery",
    price: 12.99,
    quantity: 55,
    minStock: 40,
  },
];

export function Inventory() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const getStatus = (product: Product) => {
    if (product.quantity === 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (product.quantity < product.minStock)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  const handleSave = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([...products, product]);
    }
    setEditingProduct(undefined);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleRestock = (product: Product) => {
    const quantity = prompt(`Enter restock quantity for ${product.name}:`, "0");
    if (quantity && !isNaN(parseInt(quantity))) {
      setProducts(
        products.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + parseInt(quantity) }
            : p,
        ),
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const status = getStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {product.minStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestock(product)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="Restock"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(undefined);
        }}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
}
