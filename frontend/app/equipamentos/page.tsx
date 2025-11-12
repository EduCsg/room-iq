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
import { Equipamento } from "@/lib/types";
import { ArrowLeft, Package, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEquipamento, setSelectedEquipamento] =
    useState<Equipamento | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    quantidade: 0,
  });

  const loadEquipamentos = () => {
    api
      .getEquipamentos()
      .then((data) => setEquipamentos(data))
      .catch((error) => console.error("Error loading equipamentos:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEquipamentos();
  }, []);

  const handleCreate = async () => {
    try {
      if (!formData.nome) {
        alert("Please provide a name for the equipment");
        return;
      }
      await api.createEquipamento(formData);
      setIsCreateDialogOpen(false);
      setFormData({ nome: "", descricao: "", quantidade: 0 });
      loadEquipamentos();
    } catch (error) {
      console.error("Error creating equipamento:", error);
      alert("Error creating equipment. Please check the console for details.");
    }
  };

  const handleEdit = async () => {
    if (!selectedEquipamento) return;
    try {
      await api.updateEquipamento(selectedEquipamento.equipamento_id, formData);
      setIsEditDialogOpen(false);
      setSelectedEquipamento(null);
      setFormData({ nome: "", descricao: "", quantidade: 0 });
      loadEquipamentos();
    } catch (error) {
      console.error("Error updating equipamento:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedEquipamento) return;
    try {
      await api.deleteEquipamento(selectedEquipamento.equipamento_id);
      setIsDeleteDialogOpen(false);
      setSelectedEquipamento(null);
      loadEquipamentos();
    } catch (error) {
      console.error("Error deleting equipamento:", error);
    }
  };

  const openEditDialog = (equipamento: Equipamento) => {
    setSelectedEquipamento(equipamento);
    setFormData({
      nome: equipamento.nome,
      descricao: equipamento.descricao || "",
      quantidade: equipamento.quantidade,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (equipamento: Equipamento) => {
    setSelectedEquipamento(equipamento);
    setIsDeleteDialogOpen(true);
  };

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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quantity:
                  </span>
                  <span className="text-2xl font-bold">
                    {equipamento.quantidade}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(equipamento)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => openDeleteDialog(equipamento)}
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
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No equipment found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Equipment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
            <DialogDescription>
              Create a new equipment type in the system.
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
                placeholder="Projector"
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
                placeholder="HD projector with HDMI..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantity *</Label>
              <Input
                id="quantidade"
                type="number"
                min="0"
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidade: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setFormData({ nome: "", descricao: "", quantidade: 0 });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Equipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>
              Update the equipment information.
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
                placeholder="Projector"
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
                placeholder="HD projector with HDMI..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantidade">Quantity *</Label>
              <Input
                id="edit-quantidade"
                type="number"
                min="0"
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidade: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedEquipamento(null);
                setFormData({ nome: "", descricao: "", quantidade: 0 });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Equipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Equipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedEquipamento?.nome}</span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedEquipamento(null);
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
