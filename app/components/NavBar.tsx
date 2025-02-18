import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { User, BarChart2, Plus } from "lucide-react"
import { AddItemDialog } from "@/app/components/AddItemDialog"

export default function NavBar() {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Minha Wishlist</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => router.push('/profile')}
          className="flex items-center"
        >
          <User className="h-4 w-4 mr-2" />
          Perfil
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/stats')}
          className="flex items-center"
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Estatísticas
        </Button>
        <AddItemDialog onItemAdded={() => {}} />
      </div>
    </div>
  );
} 