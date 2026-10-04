import React, { useState } from 'react';
import { Product, ProductImage } from '../types.ts';
import { api } from '../services/api.ts';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Check,
  Eye,
  EyeOff,
  Star,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface ProductManagerModalProps {
  isOpen: boolean;
  siteId: string;
  products: Product[];
  primaryColor: string;
  onClose: () => void;
  onProductsUpdated: (updated: Product[]) => void;
}

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  siteId,
  products,
  primaryColor,
  onClose,
  onProductsUpdated,
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for edit/create
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Fashion',
    stockQty: '10',
    status: 'active' as 'active' | 'hidden',
    images: [] as ProductImage[],
  });

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartCreate = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: 'Outerwear',
      stockQty: '10',
      status: 'active',
      images: [],
    });
    setIsCreatingNew(true);
    setEditingProduct(null);
  };

  const handleStartEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      category: product.category || 'General',
      stockQty: String(product.stockQty ?? 0),
      status: product.status || 'active',
      images: product.images || [],
    });
    setEditingProduct(product);
    setIsCreatingNew(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      const payload: Partial<Product> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        category: formData.category.trim() || 'General',
        stockQty: parseInt(formData.stockQty) || 0,
        status: formData.status,
      };

      if (isCreatingNew) {
        const created = await api.createProduct(siteId, payload);
        const nextProducts = [created, ...products];
        onProductsUpdated(nextProducts);
      } else if (editingProduct) {
        const updated = await api.updateProduct(siteId, editingProduct.id, payload);
        const nextProducts = products.map((p) => (p.id === updated.id ? updated : p));
        onProductsUpdated(nextProducts);
      }

      setEditingProduct(null);
      setIsCreatingNew(false);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await api.deleteProduct(siteId, productId);
      const nextProducts = products.filter((p) => p.id !== productId);
      onProductsUpdated(nextProducts);
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
        setIsCreatingNew(false);
      }
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const updated = await api.toggleProductStatus(siteId, product.id);
      const nextProducts = products.map((p) => (p.id === updated.id ? updated : p));
      onProductsUpdated(nextProducts);
    } catch (err) {
      console.error('Failed to toggle product status:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!editingProduct) {
      // For new product before saving, generate local preview data URL
      const fileList = Array.from(files);
      fileList.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const url = ev.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            images: [
              ...prev.images,
              {
                url,
                filename: file.name,
                isMain: prev.images.length === 0,
                alt: file.name,
              },
            ],
          }));
        };
        reader.readAsDataURL(file);
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileList = Array.from(files);
      const updatedProduct = await api.uploadProductImages(siteId, editingProduct.id, fileList);
      setEditingProduct(updatedProduct);
      setFormData((prev) => ({ ...prev, images: updatedProduct.images }));
      onProductsUpdated(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to upload image. Please check file format.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async (filename: string, index: number) => {
    if (!editingProduct) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      return;
    }

    try {
      const updated = await api.deleteProductImage(siteId, editingProduct.id, filename);
      setEditingProduct(updated);
      setFormData((prev) => ({ ...prev, images: updated.images }));
      onProductsUpdated(products.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6">
      <div className="flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#DCE0F5] overflow-hidden antialiased">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE0F5] bg-[#FAFBFD]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1E1C24]">
                Product Catalog Management
              </h2>
              <p className="text-xs text-[#646074]">
                Manage store products, stock levels, pricing, and photography
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editingProduct && !isCreatingNew && (
              <button
                type="button"
                onClick={handleStartCreate}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-95 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DCE0F5] text-[#646074] hover:bg-[#F2F3FB] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {editingProduct || isCreatingNew ? (
            /* ── Product Edit / Create Form ── */
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE0F5]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingNew(false);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#646074] hover:text-[#1E1C24] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Product List</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#646074]">Status:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        status: prev.status === 'active' ? 'hidden' : 'active',
                      }))
                    }
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      formData.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {formData.status === 'active' ? (
                      <>
                        <Eye className="h-3 w-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E1C24] mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Belgian Linen Trench"
                      className="w-full rounded-xl border border-[#DCE0F5] px-3 py-2 text-xs text-[#1E1C24] focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1C24] mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Outerwear, Tops"
                        className="w-full rounded-xl border border-[#DCE0F5] px-3 py-2 text-xs text-[#1E1C24] focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1E1C24] mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stockQty}
                        onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                        className="w-full rounded-xl border border-[#DCE0F5] px-3 py-2 text-xs text-[#1E1C24] focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1C24] mb-1">
                        Regular Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="195.00"
                        className="w-full rounded-xl border border-[#DCE0F5] px-3 py-2 text-xs text-[#1E1C24] focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1E1C24] mb-1">
                        Discount Price ($) <span className="font-normal text-[#646074]">(optional)</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.discountPrice}
                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                        placeholder="145.00"
                        className="w-full rounded-xl border border-[#DCE0F5] px-3 py-2 text-xs text-[#1E1C24] focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E1C24] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the materials, craftsmanship, sizing, and styling..."
                      className="w-full rounded-xl border border-[#DCE0F5] px-3 py-2 text-xs text-[#1E1C24] focus:outline-none focus:ring-2 focus:ring-[#AF4418] resize-none"
                    />
                  </div>
                </div>

                {/* Right Column: Images & Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#1E1C24]">
                      Product Photography ({formData.images.length})
                    </label>
                    <span className="text-[11px] text-[#646074]">JPEG, PNG, WebP up to 5MB</span>
                  </div>

                  {/* Upload Dropzone */}
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#DCE0F5] hover:border-[#AF4418] rounded-2xl bg-[#FAFBFD] cursor-pointer transition-colors group">
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-[#AF4418]" />
                        <span className="text-xs font-medium text-[#646074]">Uploading photo...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="p-3 rounded-xl bg-white border border-[#DCE0F5] text-[#AF4418] shadow-2xs group-hover:scale-105 transition-transform">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#1E1C24]">
                            Click to upload photos
                          </p>
                          <p className="text-[11px] text-[#646074]">or drag & drop images here</p>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Image Gallery */}
                  {formData.images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl overflow-hidden border border-[#DCE0F5] bg-gray-100 aspect-square shadow-2xs"
                        >
                          <img
                            src={img.url}
                            alt={img.alt || formData.name}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-[#AF4418] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              <span>Main</span>
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(img.filename, idx)}
                              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-[#DCE0F5] text-center text-xs text-[#646074]">
                      No photos uploaded yet. High-res imagery drives higher conversion.
                    </div>
                  )}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-[#DCE0F5] flex items-center justify-between">
                {editingProduct ? (
                  deleteConfirmId === editingProduct.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600 font-semibold">Confirm delete?</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(editingProduct.id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(editingProduct.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Product</span>
                    </button>
                  )
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsCreatingNew(false);
                    }}
                    className="px-4 py-2 border border-[#DCE0F5] rounded-xl text-xs font-semibold text-[#646074] hover:bg-[#F2F3FB]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-95 disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span>{isCreatingNew ? 'Create Product' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ── Product List View ── */
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by title or category..."
                    className="w-full rounded-xl border border-[#DCE0F5] bg-[#FAFBFD] px-3.5 py-2 text-xs text-[#1E1C24] focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#1E1C24] text-white font-bold'
                          : 'bg-[#F2F3FB] text-[#646074] hover:text-[#1E1C24]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table / Cards */}
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-[#DCE0F5] rounded-3xl space-y-3 bg-[#FAFBFD]">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCEEE8] text-[#AF4418]">
                    <Package className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#1E1C24]">
                    No products found
                  </h4>
                  <p className="text-xs text-[#646074] max-w-sm mx-auto">
                    {searchQuery
                      ? 'No items matched your search query. Try another keyword.'
                      : 'Get started by creating your first product with photography, stock, and pricing.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleStartCreate}
                    className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-95"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Add First Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 divide-y divide-[#DCE0F5] border border-[#DCE0F5] rounded-2xl overflow-hidden bg-white">
                  {filteredProducts.map((p) => {
                    const mainImg = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3.5 hover:bg-[#FAFBFD] transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={mainImg}
                            alt={p.name}
                            className="h-12 w-12 rounded-xl object-cover border border-[#DCE0F5] shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif text-sm font-bold text-[#1E1C24]">
                                {p.name}
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(p)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                                  p.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-gray-100 text-gray-500 border-gray-200'
                                }`}
                              >
                                {p.status === 'active' ? 'Active' : 'Hidden'}
                              </button>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#646074] mt-0.5">
                              <span className="font-medium text-[#1E1C24]">${p.price}</span>
                              {p.discountPrice && (
                                <span className="line-through text-red-500 text-[11px]">
                                  ${p.discountPrice}
                                </span>
                              )}
                              <span>·</span>
                              <span>{p.category}</span>
                              <span>·</span>
                              <span>{p.stockQty} in stock</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(p)}
                            className="px-3 py-1.5 rounded-xl border border-[#DCE0F5] text-xs font-semibold text-[#1E1C24] hover:bg-[#F2F3FB] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-xl border border-[#DCE0F5] text-[#646074] hover:text-red-600 hover:border-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#DCE0F5] bg-[#FAFBFD] flex items-center justify-between text-xs text-[#646074]">
          <span>Total products: {products.length} ({products.filter((p) => p.status === 'active').length} active)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1E1C24] text-white rounded-xl font-semibold hover:bg-black transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
