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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { Bloco } from "@/lib/types";
import { ArrowLeft, Building2, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlocosPage() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBloco, setSelectedBloco] = useState<Bloco | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    andar: "",
  });

  const loadBlocos = () => {
    api
      .getBlocos()
      .then((data) => setBlocos(data))
      .catch((error) => console.error("Error loading blocos:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlocos();
  }, []);

  const handleCreate = async () => {
    try {
      if (!formData.nome) {
        alert("Please provide a name for the building");
        return;
      }
      await api.createBloco(formData);
      setIsCreateDialogOpen(false);
      setFormData({ nome: "", descricao: "", andar: "" });
      loadBlocos();
    } catch (error) {
      console.error("Error creating bloco:", error);
      alert("Error creating building. Please check the console for details.");
    }
  };

  const handleEdit = async () => {
    if (!selectedBloco) return;
    try {
      await api.updateBloco(selectedBloco.bloco_id, formData);
      setIsEditDialogOpen(false);
      setSelectedBloco(null);
      setFormData({ nome: "", descricao: "", andar: "" });
      loadBlocos();
    } catch (error) {
      console.error("Error updating bloco:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedBloco) return;
    try {
      await api.deleteBloco(selectedBloco.bloco_id);
      setIsDeleteDialogOpen(false);
      setSelectedBloco(null);
      loadBlocos();
    } catch (error) {
      console.error("Error deleting bloco:", error);
    }
  };

  const openEditDialog = (bloco: Bloco) => {
    setSelectedBloco(bloco);
    setFormData({
      nome: bloco.nome,
      descricao: bloco.descricao || "",
      andar: bloco.andar || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (bloco: Bloco) => {
    setSelectedBloco(bloco);
    setIsDeleteDialogOpen(true);
  };

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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                  <div className="text-sm mb-4">
                    <span className="text-muted-foreground">Floor: </span>
                    <span className="font-medium">{bloco.andar}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(bloco)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => openDeleteDialog(bloco)}
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
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No buildings found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Building
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Building</DialogTitle>
            <DialogDescription>
              Create a new building in the system.
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
                placeholder="Building A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Description</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Main academic building..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="andar">Floor</Label>
              <Input
                id="andar"
                value={formData.andar}
                onChange={(e) =>
                  setFormData({ ...formData, andar: e.target.value })
                }
                placeholder="Ground Floor"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setFormData({ nome: "", descricao: "", andar: "" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Building</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Building</DialogTitle>
            <DialogDescription>
              Update the building information.
            </DialogDescription>
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
                placeholder="Building A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-descricao">Description</Label>
              <Textarea
                id="edit-descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Main academic building..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-andar">Floor</Label>
              <Input
                id="edit-andar"
                value={formData.andar}
                onChange={(e) =>
                  setFormData({ ...formData, andar: e.target.value })
                }
                placeholder="Ground Floor"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedBloco(null);
                setFormData({ nome: "", descricao: "", andar: "" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Building</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Building</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedBloco?.nome}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedBloco(null);
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
