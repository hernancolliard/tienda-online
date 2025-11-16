import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Si no hay sesión o el usuario no es admin, redirigir a la página de inicio
  if (!session || session.user?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Gestionar Productos</h2>
          <p>Añadir, editar y eliminar productos.</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Gestionar Categorías</h2>
          <p>Organizar los productos en categorías.</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Productos Destacados</h2>
          <p>Seleccionar productos para la página de inicio.</p>
        </div>

      </div>
    </div>
  )
}
