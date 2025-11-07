"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Equipamento } from "@/lib/types";
import { Package, ArrowLeft, Plus } from "lucide-react";

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getEquipamentos()
      .then((data) => setEquipamentos(data))
      .catch((error) => console.error("Error loading equipamentos:", error))
      .finally(() => setLoading(false));
  }, []);

  const totalQuantity = equipamentos.reduce(
    (sum, eq) => sum + eq.quantidade,
    0
  );

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold">Equipment</h1>
          <p className="text-muted-foreground mt-2">
            {equipamentos.length} types • {totalQuantity} total items
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {equipamentos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipamentos.map((equipamento) => (
            <Card
              key={equipamento.equipamento_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">
                      {equipamento.nome}
                    </CardTitle>
                  </div>
                </div>
                {equipamento.descricao && (
                  <CardDescription>{equipamento.descricao}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quantity:
                  </span>
                  <span className="text-2xl font-bold">
                    {equipamento.quantidade}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No equipment found</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Equipment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
