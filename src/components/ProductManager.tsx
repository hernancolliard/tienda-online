'use client'

import { useState, useEffect, FormEvent, useRef, DragEvent } from 'react';

// Extiende la interfaz para incluir todos los campos del formulario
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: number;
  category_name?: string; // El GET principal lo trae
  stock_quantity: number;
  sizes: string[];
  is_featured: boolean;
}

interface Category {
  id: number;
  name: string;
}

const initialFormState = {
  name: '',
  description: '',
  price: '',
  images: [] as string[], // Now an array of base64 strings
  category_id: '',
  stock_quantity: '0',
  sizes: '', // Comma-separated sizes
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State para el formulario y para saber si estamos editando
  const [formState, setFormState] = useState(initialFormState);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      if (!productsRes.ok || !categoriesRes.ok) throw new Error('No se pudieron cargar los datos.');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const processFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const newImagePreviews: string[] = [];
    const newBase64Images: string[] = [];

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          newImagePreviews.push(reader.result);
          newBase64Images.push(reader.result); // Store base64 string
          if (newImagePreviews.length === fileArray.length) {
            setImagePreviews(prev => [...prev, ...newImagePreviews]);
            setFormState(prevState => ({
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
    e.stopPropagation(); // Necessary to allow dropping
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
    // Create new arrays with the image removed
    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1);

    const newBase64Images = [...formState.images];
    newBase64Images.splice(index, 1);

    // Update the state
    setImagePreviews(newImagePreviews);
    setFormState(prevState => ({
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
      images: formState.images, // Already an array of base64 strings
      sizes: formState.sizes.split(',').map(s => s.trim()).filter(s => s),
      is_featured: editingProduct ? editingProduct.is_featured : false,
    };

    if (!productData.name || !productData.price || !productData.category_id) {
      return setError('Nombre, precio y categoría son requeridos.');
    }

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `No se pudo ${editingProduct ? 'actualizar' : 'crear'} el producto.`);
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
      description: product.description || '',
      price: String(product.price),
      images: product.images || [], // Ensure it's an array
      category_id: String(product.category_id),
      stock_quantity: String(product.stock_quantity),
      sizes: (product.sizes || []).join(', '),
    });
    setImagePreviews(product.images || []); // Set image previews for editing
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setError(null);
    setEditingProduct(null);
    setFormState(initialFormState);
    setImagePreviews([]); // Clear previews for new product
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormState(initialFormState);
    setImagePreviews([]); // Clear previews on close
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo eliminar el producto.');
      }
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-8 text-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestionar Productos</h2>
        <button onClick={openModalForAdd} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Añadir Producto
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        {loading ? <p>Cargando...</p> : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Categoría</th>
                <th className="py-2 px-4 border-b">Precio</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b text-center">{product.name}</td>
                  <td className="py-2 px-4 border-b text-center">{product.category_name}</td>
                  <td className="py-2 px-4 border-b text-center">${product.price}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openModalForEdit(product)} className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
                      <button onClick={() => handleDelete(product.id)} className="text-sm text-red-600 hover:text-red-800">Eliminar</button>
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
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-900">
            <h3 className="text-2xl font-bold mb-6">{editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre</label>
                <input id="name" name="name" type="text" value={formState.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Descripción</label>
                <textarea id="description" name="description" value={formState.description} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Precio</label>
                <input id="price" name="price" type="number" step="0.01" value={formState.price} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium mb-1">Categoría</label>
                <select id="category_id" name="category_id" value={formState.category_id} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
                  <option value="" disabled>Selecciona una categoría</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium mb-1">Cantidad (Stock)</label>
                <input id="stock_quantity" name="stock_quantity" type="number" value={formState.stock_quantity} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="sizes" className="block text-sm font-medium mb-1">Talles (separados por coma)</label>
                <input id="sizes" name="sizes" type="text" value={formState.sizes} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Imágenes</label>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" // Hide the default file input
                />
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full p-6 border-2 border-dashed rounded-md cursor-pointer text-center transition-colors
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                >
                  <p className="text-gray-500">Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {imagePreviews.map((src, index) => (
                    <div key={src} className="relative">
                      <img src={src} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-1 right-1 bg-white text-red-600 border border-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-100"
                        aria-label="Eliminar imagen"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{editingProduct ? 'Guardar Cambios' : 'Guardar Producto'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
