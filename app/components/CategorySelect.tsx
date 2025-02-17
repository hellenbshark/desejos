import { useCategories } from '@/app/contexts/CategoryContext';

export function CategorySelect() {
  const { categories } = useCategories();
  
  // Use categories aqui...
} 