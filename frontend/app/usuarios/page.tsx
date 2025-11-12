"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { Usuario } from "@/lib/types";
import { ArrowLeft, Mail, Pencil, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const loadUsuarios = () => {
    api
      .getUsuarios()
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error loading usuarios:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleCreate = async () => {
    try {
      if (!formData.nome || !formData.email || !formData.senha) {
        alert("Please fill in all required fields");
        return;
      }
      await api.createUsuario(formData);
      setIsCreateDialogOpen(false);
      setFormData({ nome: "", email: "", senha: "" });
      loadUsuarios();
    } catch (error) {
      console.error("Error creating usuario:", error);
      alert("Error creating user. Please check the console for details.");
    }
  };

  const handleEdit = async () => {
    if (!selectedUsuario) return;
    try {
      // Only send senha if it's not empty
      const dataToSend = formData.senha
        ? formData
        : { nome: formData.nome, email: formData.email };
      await api.updateUsuario(selectedUsuario.usuario_id, dataToSend);
      setIsEditDialogOpen(false);
      setSelectedUsuario(null);
      setFormData({ nome: "", email: "", senha: "" });
      loadUsuarios();
    } catch (error) {
      console.error("Error updating usuario:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUsuario) return;
    try {
      await api.deleteUsuario(selectedUsuario.usuario_id);
      setIsDeleteDialogOpen(false);
      setSelectedUsuario(null);
      loadUsuarios();
    } catch (error) {
      console.error("Error deleting usuario:", error);
    }
  };

  const openEditDialog = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "", // Leave empty, will only update if user provides a new password
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsDeleteDialogOpen(true);
  };

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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
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
              <CardContent className="space-y-4">
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(usuario)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => openDeleteDialog(usuario)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First User
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Name *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Password *</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
                placeholder="Enter password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setFormData({ nome: "", email: "", senha: "" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nome">Name *</Label>
              <Input
                id="edit-nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-senha">Password</Label>
              <Input
                id="edit-senha"
                type="password"
                value={formData.senha}
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
                placeholder="Leave empty to keep current password"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to keep the current password
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedUsuario(null);
                setFormData({ nome: "", email: "", senha: "" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedUsuario?.nome}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUsuario(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
