import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import CategoryManager from "@/components/CategoryManager"
import ProductManager from "@/components/ProductManager"
import FeaturedManager from "@/components/FeaturedManager"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Si no hay sesión o el usuario no es admin, redirigir a la página de inicio
  if (!session || session.user?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-text">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CategoryManager />
          <FeaturedManager />
        </div>
        <div>
          <ProductManager />
        </div>
      </div>

    </div>
  )
}
