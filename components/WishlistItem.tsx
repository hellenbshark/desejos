import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WishlistItemProps {
  id: string;
  title: string;
  description: string;
  price: number;
  priority: string;
  onDelete?: (id: string) => void;
}

export default function WishlistItem({ 
  id, 
  title, 
  description, 
  price, 
  priority,
  onDelete 
}: WishlistItemProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant={
            priority === 'Alta' ? 'destructive' : 
            priority === 'Média' ? 'default' : 
            'secondary'
          }>
            {priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <p className="font-semibold">R$ {price.toFixed(2)}</p>
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(id)}
            >
              Remover
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
