import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import CategoryManager from "@/components/CategoryManager"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Si no hay sesión o el usuario no es admin, redirigir a la página de inicio
  if (!session || session.user?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      
      {/* Componente para gestionar categorías */}
      <CategoryManager />

      {/* Aquí se añadirán más componentes de gestión en el futuro */}
    </div>
  )
}
