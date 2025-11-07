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
import { Usuario } from "@/lib/types";
import { Users, ArrowLeft, Plus, Mail } from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getUsuarios()
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error loading usuarios:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading users...</p>
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
          <h1 className="text-4xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">
            {usuarios.length} registered users
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {usuarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <Card
              key={usuario.usuario_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{usuario.nome}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {usuario.email}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {usuario.data_criacao && (
                    <div>
                      <span>Joined: </span>
                      <span>
                        {new Date(usuario.data_criacao).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {usuario.data_atualizacao && (
                    <div>
                      <span>Last updated: </span>
                      <span>
                        {new Date(
                          usuario.data_atualizacao
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No users found</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First User
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
