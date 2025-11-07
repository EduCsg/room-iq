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
import { Sala } from "@/lib/types";
import { DoorOpen, ArrowLeft, Plus, Users, Building2 } from "lucide-react";

export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getSalas()
      .then((data) => setSalas(data))
      .catch((error) => console.error("Error loading salas:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading rooms...</p>
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
          <h1 className="text-4xl font-bold">Rooms</h1>
          <p className="text-muted-foreground mt-2">
            Manage all rooms in the system
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {salas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salas.map((sala) => (
            <Card
              key={sala.sala_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <DoorOpen className="h-5 w-5 text-primary" />
                    <CardTitle>{sala.nome}</CardTitle>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    #{sala.sala_id}
                  </span>
                </div>
                {sala.descricao && (
                  <CardDescription>{sala.descricao}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Capacity: {sala.capacidade} people</span>
                </div>
                {sala.bloco_nome && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{sala.bloco_nome}</span>
                  </div>
                )}
                {sala.equipamentos && sala.equipamentos.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {sala.equipamentos.length} equipment item(s)
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DoorOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No rooms found</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Room
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
