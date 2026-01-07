"use client";

import { useState, useEffect, FormEvent, useRef, DragEvent } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: number;
  category_name?: string;
  stock_quantity: number;
  sizes: string[];
  is_featured: boolean;
  discount_percentage?: number;
}

interface Category {
  id: number;
  name: string;
}

const initialFormState = {
  name: "",
  description: "",
  price: "",
  images: [] as string[],
  category_id: "",
  stock_quantity: "0",
  sizes: "",
  discount_percentage: "0",
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formState, setFormState] = useState(initialFormState);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      if (!productsRes.ok || !categoriesRes.ok)
        throw new Error("No se pudieron cargar los datos.");
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const processFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const newImagePreviews: string[] = [];
    const newBase64Images: string[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          newImagePreviews.push(reader.result);
          newBase64Images.push(reader.result);
          if (newImagePreviews.length === fileArray.length) {
            setImagePreviews((prev) => [...prev, ...newImagePreviews]);
            setFormState((prevState) => ({
              ...prevState,
              images: [...prevState.images, ...newBase64Images],
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1);

    const newBase64Images = [...formState.images];
    newBase64Images.splice(index, 1);

    setImagePreviews(newImagePreviews);
    setFormState((prevState) => ({
      ...prevState,
      images: newBase64Images,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const productData = {
      ...formState,
      price: parseFloat(formState.price),
      stock_quantity: parseInt(formState.stock_quantity, 10),
      category_id: parseInt(formState.category_id, 10),
      images: formState.images,
      sizes: formState.sizes.split(",").map((s) => s.trim()).filter((s) => s),
      is_featured: editingProduct ? editingProduct.is_featured : false,
      discount_percentage: parseInt(formState.discount_percentage, 10) || 0,
    };

    if (!productData.name || !productData.price || !productData.category_id) {
      return setError("Nombre, precio y categoría son requeridos.");
    }

    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `No se pudo ${editingProduct ? "actualizar" : "crear"} el producto.`
        );
      }

      await fetchData();
      closeModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openModalForEdit = (product: Product) => {
    setError(null);
    setEditingProduct(product);
    setFormState({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      images: product.images || [],
      category_id: String(product.category_id),
      stock_quantity: String(product.stock_quantity),
      sizes: (product.sizes || []).join(", "),
      discount_percentage: String(product.discount_percentage || 0),
    });
    setImagePreviews(product.images || []);
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setError(null);
    setEditingProduct(null);
    setFormState(initialFormState);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormState(initialFormState);
    setImagePreviews([]);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?"))
      return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "No se pudo eliminar el producto."
        );
      }
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  return (
    <div className="p-6 bg-component-bg rounded-lg shadow-xl mt-8 text-primary-text">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestionar Productos</h2>
        <button
          onClick={openModalForAdd}
          className="px-4 py-2 bg-primary-text text-white rounded-md hover:opacity-90"
        >
          Añadir Producto
        </button>
      </div>

      {error && <p className="text-red mb-4">{error}</p>}

      <div className="overflow-x-auto">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="min-w-full bg-background rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-primary-text/20">Nombre</th>
                <th className="py-2 px-4 border-b border-primary-text/20">Categoría</th>
                <th className="py-2 px-4 border-b border-primary-text/20">Precio Original</th>
                <th className="py-2 px-4 border-b border-primary-text/20">Precio Descuento</th>
                <th className="py-2 px-4 border-b border-primary-text/20">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b border-primary-text/10 text-center">
                    {product.name}
                  </td>
                  <td className="py-2 px-4 border-b border-primary-text/10 text-center">
                    {product.category_name}
                  </td>
                  <td className="py-2 px-4 border-b border-primary-text/10 text-center">
                    ${product.price}
                  </td>
                  <td className="py-2 px-4 border-b border-primary-text/10 text-center">
                    {product.discount_percentage && product.discount_percentage > 0 ? (
                      `$${calculateDiscountedPrice(product.price, product.discount_percentage).toFixed(2)} (${product.discount_percentage}%)`
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-primary-text/10 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModalForEdit(product)}
                        className="text-sm text-primary-text hover:opacity-80"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-sm text-red hover:opacity-80"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-component-bg p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-primary-text">
            <h3 className="text-2xl font-bold mb-6">
              {editingProduct ? "Editar Producto" : "Añadir Nuevo Producto"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre</label>
                <input id="name" name="name" type="text" value={formState.name} onChange={handleInputChange} className="w-full p-2 border border-primary-text/20 rounded-md bg-background text-primary-text" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Descripción</label>
                <textarea id="description" name="description" value={formState.description} onChange={handleInputChange} className="w-full p-2 border border-primary-text/20 rounded-md bg-background text-primary-text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">Precio</label>
                  <input id="price" name="price" type="number" step="0.01" value={formState.price} onChange={handleInputChange} className="w-full p-2 border border-primary-text/20 rounded-md bg-background text-primary-text" required />
                </div>
                <div>
                  <label htmlFor="discount_percentage" className="block text-sm font-medium mb-1">Descuento (%)</label>
                  <input id="discount_percentage" name="discount_percentage" type="number" value={formState.discount_percentage} onChange={handleInputChange} className="w-full p-2 border border-primary-text/20 rounded-md bg-background text-primary-text" />
                </div>
              </div>
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium mb-1">Categoría</label>
                <select id="category_id" name="category_id" value={formState.category_id} onChange={handleInputChange} className="w-full p-2 border border-primary-text/20 rounded-md bg-background text-primary-text" required>
                  <option value="" disabled>Selecciona una categoría</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium mb-1">Cantidad (Stock)</label>
                <input id="stock_quantity" name="stock_quantity" type="number" value={formState.stock_quantity} onChange={handleInputChange} className="w-full p-2 border border-primary-text/20 rounded-md bg-background text-primary-text" />
              </div>
              <div>
                <label htmlFor="sizes" className="block text-sm font-medium mb-1">Talles (separados por coma)</label>
                <input id="sizes" name="sizes" type="text" value={formState.sizes} onChange={handleInputChange} className="w-full p-2 border border-primary-text/20 rounded-md bg-background text-primary-text" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Imágenes</label>
                <input id="images" name="images" type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`w-full p-6 border-2 border-dashed rounded-md cursor-pointer text-center transition-colors ${isDragging ? "border-primary-text bg-primary-text/10" : "border-primary-text/30 bg-background hover:bg-black/5"}`}>
                  <p className="text-primary-text/70">Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {imagePreviews.map((src, index) => (
                    <div key={src} className="relative">
                      <Image key={index} src={src} alt={`Preview ${index}`} width={96} height={96} className="object-cover rounded-md" />
                      <button type="button" onClick={() => handleDeleteImage(index)} className="absolute top-1 right-1 bg-background text-red border border-red rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red/10" aria-label="Eliminar imagen">X</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-primary-text/20 rounded-md hover:bg-primary-text/30">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary-text text-white rounded-md hover:opacity-90">{editingProduct ? "Guardar Cambios" : "Guardar Producto"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
