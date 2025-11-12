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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { Bloco, Sala } from "@/lib/types";
import {
  ArrowLeft,
  Building2,
  DoorOpen,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    capacidade: 0,
    bloco_id: "",
  });

  const loadSalas = () => {
    api
      .getSalas()
      .then((data) => setSalas(data))
      .catch((error) => console.error("Error loading salas:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSalas();
    api
      .getBlocos()
      .then((data) => setBlocos(data))
      .catch((error) => console.error("Error loading blocos:", error));
  }, []);

  const handleCreate = async () => {
    try {
      if (!formData.nome) {
        alert("Please provide a name for the room");
        return;
      }
      const dataToSend = {
        ...formData,
        bloco_id: formData.bloco_id ? parseInt(formData.bloco_id) : undefined,
      };
      await api.createSala(dataToSend);
      setIsCreateDialogOpen(false);
      setFormData({ nome: "", descricao: "", capacidade: 0, bloco_id: "" });
      loadSalas();
    } catch (error) {
      console.error("Error creating sala:", error);
      alert("Error creating room. Please check the console for details.");
    }
  };

  const handleEdit = async () => {
    if (!selectedSala) return;
    try {
      const dataToSend = {
        ...formData,
        bloco_id: formData.bloco_id ? parseInt(formData.bloco_id) : undefined,
      };
      await api.updateSala(selectedSala.sala_id, dataToSend);
      setIsEditDialogOpen(false);
      setSelectedSala(null);
      setFormData({ nome: "", descricao: "", capacidade: 0, bloco_id: "" });
      loadSalas();
    } catch (error) {
      console.error("Error updating sala:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedSala) return;
    try {
      await api.deleteSala(selectedSala.sala_id);
      setIsDeleteDialogOpen(false);
      setSelectedSala(null);
      loadSalas();
    } catch (error) {
      console.error("Error deleting sala:", error);
    }
  };

  const openEditDialog = (sala: Sala) => {
    setSelectedSala(sala);
    setFormData({
      nome: sala.nome,
      descricao: sala.descricao || "",
      capacidade: sala.capacidade,
      bloco_id: sala.bloco_id?.toString() || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (sala: Sala) => {
    setSelectedSala(sala);
    setIsDeleteDialogOpen(true);
  };

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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
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
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(sala)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => openDeleteDialog(sala)}
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
            <DoorOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No rooms found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Room
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Create a new room in the system.
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
                placeholder="Room 101"
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
                placeholder="Conference room with projector..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacity *</Label>
              <Input
                id="capacidade"
                type="number"
                min="0"
                value={formData.capacidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacidade: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloco_id">Building</Label>
              <Select
                value={formData.bloco_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, bloco_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a building" />
                </SelectTrigger>
                <SelectContent>
                  {blocos.map((bloco) => (
                    <SelectItem
                      key={bloco.bloco_id}
                      value={bloco.bloco_id.toString()}
                    >
                      {bloco.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setFormData({
                  nome: "",
                  descricao: "",
                  capacidade: 0,
                  bloco_id: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update the room information.</DialogDescription>
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
                placeholder="Room 101"
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
                placeholder="Conference room with projector..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-capacidade">Capacity *</Label>
              <Input
                id="edit-capacidade"
                type="number"
                min="0"
                value={formData.capacidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacidade: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bloco_id">Building</Label>
              <Select
                value={formData.bloco_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, bloco_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a building" />
                </SelectTrigger>
                <SelectContent>
                  {blocos.map((bloco) => (
                    <SelectItem
                      key={bloco.bloco_id}
                      value={bloco.bloco_id.toString()}
                    >
                      {bloco.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedSala(null);
                setFormData({
                  nome: "",
                  descricao: "",
                  capacidade: 0,
                  bloco_id: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedSala?.nome}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedSala(null);
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
