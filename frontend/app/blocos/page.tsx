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
import { Bloco } from "@/lib/types";
import { Building2, ArrowLeft, Plus } from "lucide-react";

export default function BlocosPage() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBlocos()
      .then((data) => setBlocos(data))
      .catch((error) => console.error("Error loading blocos:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading buildings...</p>
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
          <h1 className="text-4xl font-bold">Buildings</h1>
          <p className="text-muted-foreground mt-2">
            Manage all buildings in the system
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Building
        </Button>
      </div>

      {blocos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocos.map((bloco) => (
            <Card
              key={bloco.bloco_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle>{bloco.nome}</CardTitle>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    #{bloco.bloco_id}
                  </span>
                </div>
                {bloco.descricao && (
                  <CardDescription>{bloco.descricao}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {bloco.andar && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Floor: </span>
                    <span className="font-medium">{bloco.andar}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No buildings found</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Building
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
