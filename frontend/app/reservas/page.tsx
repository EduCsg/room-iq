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
import { api } from "@/lib/api";
import { Reserva, Sala, Usuario } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  DoorOpen,
  Pencil,
  Plus,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [formData, setFormData] = useState({
    usuario_id: "",
    sala_id: "",
    data_reserva: "",
    hora_inicio: "",
    hora_fim: "",
    status: "pendente" as "pendente" | "confirmada" | "cancelada",
  });

  const loadReservas = () => {
    api
      .getReservas()
      .then((data) => setReservas(data))
      .catch((error) => console.error("Error loading reservas:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservas();
    api
      .getSalas()
      .then((data) => setSalas(data))
      .catch((error) => console.error("Error loading salas:", error));
    api
      .getUsuarios()
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error loading usuarios:", error));
  }, []);

  const handleCreate = async () => {
    try {
      if (
        !formData.usuario_id ||
        !formData.sala_id ||
        !formData.data_reserva ||
        !formData.hora_inicio
      ) {
        alert(
          "Please fill in all required fields (User, Room, Date, Start Time)"
        );
        return;
      }

      // Combine date with time to create proper timestamps
      const hora_inicio_timestamp = `${formData.data_reserva}T${formData.hora_inicio}:00`;
      const hora_fim_timestamp = formData.hora_fim
        ? `${formData.data_reserva}T${formData.hora_fim}:00`
        : undefined;

      const dataToSend = {
        usuario_id: parseInt(formData.usuario_id),
        sala_id: parseInt(formData.sala_id),
        data_reserva: formData.data_reserva,
        hora_inicio: hora_inicio_timestamp,
        hora_fim: hora_fim_timestamp,
        status: formData.status,
      };
      await api.createReserva(dataToSend);
      setIsCreateDialogOpen(false);
      setFormData({
        usuario_id: "",
        sala_id: "",
        data_reserva: "",
        hora_inicio: "",
        hora_fim: "",
        status: "pendente",
      });
      loadReservas();
    } catch (error) {
      console.error("Error creating reserva:", error);
      alert(
        "Error creating reservation. Please check the console for details."
      );
    }
  };

  const handleEdit = async () => {
    if (!selectedReserva) return;
    try {
      // Combine date with time to create proper timestamps
      const hora_inicio_timestamp = `${formData.data_reserva}T${formData.hora_inicio}:00`;
      const hora_fim_timestamp = formData.hora_fim
        ? `${formData.data_reserva}T${formData.hora_fim}:00`
        : undefined;

      const dataToSend = {
        usuario_id: parseInt(formData.usuario_id),
        sala_id: parseInt(formData.sala_id),
        data_reserva: formData.data_reserva,
        hora_inicio: hora_inicio_timestamp,
        hora_fim: hora_fim_timestamp,
        status: formData.status,
      };
      await api.updateReserva(selectedReserva.reserva_id, dataToSend);
      setIsEditDialogOpen(false);
      setSelectedReserva(null);
      setFormData({
        usuario_id: "",
        sala_id: "",
        data_reserva: "",
        hora_inicio: "",
        hora_fim: "",
        status: "pendente",
      });
      loadReservas();
    } catch (error) {
      console.error("Error updating reserva:", error);
      alert(
        "Error updating reservation. Please check the console for details."
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedReserva) return;
    try {
      await api.deleteReserva(selectedReserva.reserva_id);
      setIsDeleteDialogOpen(false);
      setSelectedReserva(null);
      loadReservas();
    } catch (error) {
      console.error("Error deleting reserva:", error);
    }
  };

  const handleStatusChange = async (reservaId: number, newStatus: string) => {
    try {
      await api.updateReservaStatus(reservaId, newStatus);
      loadReservas();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const openEditDialog = (reserva: Reserva) => {
    setSelectedReserva(reserva);

    // Format dates for inputs
    const dataReserva = new Date(reserva.data_reserva)
      .toISOString()
      .split("T")[0];

    // Extract time from ISO string to avoid timezone issues
    const horaInicio = reserva.hora_inicio.includes("T")
      ? reserva.hora_inicio.split("T")[1].slice(0, 5)
      : new Date(reserva.hora_inicio).toISOString().slice(11, 16);

    const horaFim = reserva.hora_fim
      ? reserva.hora_fim.includes("T")
        ? reserva.hora_fim.split("T")[1].slice(0, 5)
        : new Date(reserva.hora_fim).toISOString().slice(11, 16)
      : "";

    setFormData({
      usuario_id: reserva.usuario_id?.toString() || "",
      sala_id: reserva.sala_id?.toString() || "",
      data_reserva: dataReserva,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      status: reserva.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setIsDeleteDialogOpen(true);
  };

  const confirmedCount = reservas.filter(
    (r) => r.status === "confirmada"
  ).length;
  const pendingCount = reservas.filter((r) => r.status === "pendente").length;
  const cancelledCount = reservas.filter(
    (r) => r.status === "cancelada"
  ).length;

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading reservations...</p>
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
          <h1 className="text-4xl font-bold">Reservations</h1>
          <p className="text-muted-foreground mt-2">
            {confirmedCount} confirmed • {pendingCount} pending •{" "}
            {cancelledCount} cancelled
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {confirmedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {cancelledCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations List */}
      {reservas.length > 0 ? (
        <div className="space-y-4">
          {reservas.map((reserva) => (
            <Card
              key={reserva.reserva_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">
                        Reservation #{reserva.reserva_id}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      {new Date(
                        reserva.data_reserva + "T00:00:00"
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reserva.status === "confirmada"
                          ? "bg-green-100 text-green-800"
                          : reserva.status === "pendente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {reserva.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground text-xs">User</div>
                      <div className="font-medium">
                        {reserva.usuario_nome || "Unknown User"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DoorOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground text-xs">Room</div>
                      <div className="font-medium">
                        {reserva.sala_nome || "Unknown Room"}
                      </div>
                      {reserva.bloco_nome && (
                        <div className="text-xs text-muted-foreground">
                          {reserva.bloco_nome}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground text-xs">Time</div>
                      <div className="font-medium">
                        {reserva.hora_inicio.includes("T")
                          ? reserva.hora_inicio.split("T")[1].slice(0, 5)
                          : new Date(reserva.hora_inicio)
                              .toISOString()
                              .slice(11, 16)}
                        {reserva.hora_fim &&
                          ` - ${
                            reserva.hora_fim.includes("T")
                              ? reserva.hora_fim.split("T")[1].slice(0, 5)
                              : new Date(reserva.hora_fim)
                                  .toISOString()
                                  .slice(11, 16)
                          }`}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {reserva.status === "pendente" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700"
                      onClick={() =>
                        handleStatusChange(reserva.reserva_id, "confirmada")
                      }
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirm
                    </Button>
                  )}
                  {reserva.status !== "cancelada" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() =>
                        handleStatusChange(reserva.reserva_id, "cancelada")
                      }
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(reserva)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => openDeleteDialog(reserva)}
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
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No reservations found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Reservation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Reservation</DialogTitle>
            <DialogDescription>
              Create a new reservation in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario_id">User *</Label>
              <Select
                value={formData.usuario_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, usuario_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((usuario) => (
                    <SelectItem
                      key={usuario.usuario_id}
                      value={usuario.usuario_id.toString()}
                    >
                      {usuario.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sala_id">Room *</Label>
              <Select
                value={formData.sala_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, sala_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {salas.map((sala) => (
                    <SelectItem
                      key={sala.sala_id}
                      value={sala.sala_id.toString()}
                    >
                      {sala.nome} {sala.bloco_nome && `- ${sala.bloco_nome}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_reserva">Date *</Label>
              <Input
                id="data_reserva"
                type="date"
                value={formData.data_reserva}
                onChange={(e) =>
                  setFormData({ ...formData, data_reserva: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Start Time *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) =>
                    setFormData({ ...formData, hora_inicio: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora_fim">End Time</Label>
                <Input
                  id="hora_fim"
                  type="time"
                  value={formData.hora_fim}
                  onChange={(e) =>
                    setFormData({ ...formData, hora_fim: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(
                  value: "pendente" | "confirmada" | "cancelada"
                ) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pending</SelectItem>
                  <SelectItem value="confirmada">Confirmed</SelectItem>
                  <SelectItem value="cancelada">Cancelled</SelectItem>
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
                  usuario_id: "",
                  sala_id: "",
                  data_reserva: "",
                  hora_inicio: "",
                  hora_fim: "",
                  status: "pendente",
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Reservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
            <DialogDescription>
              Update the reservation information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-usuario_id">User *</Label>
              <Select
                value={formData.usuario_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, usuario_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((usuario) => (
                    <SelectItem
                      key={usuario.usuario_id}
                      value={usuario.usuario_id.toString()}
                    >
                      {usuario.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sala_id">Room *</Label>
              <Select
                value={formData.sala_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, sala_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {salas.map((sala) => (
                    <SelectItem
                      key={sala.sala_id}
                      value={sala.sala_id.toString()}
                    >
                      {sala.nome} {sala.bloco_nome && `- ${sala.bloco_nome}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-data_reserva">Date *</Label>
              <Input
                id="edit-data_reserva"
                type="date"
                value={formData.data_reserva}
                onChange={(e) =>
                  setFormData({ ...formData, data_reserva: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-hora_inicio">Start Time *</Label>
                <Input
                  id="edit-hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) =>
                    setFormData({ ...formData, hora_inicio: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hora_fim">End Time</Label>
                <Input
                  id="edit-hora_fim"
                  type="time"
                  value={formData.hora_fim}
                  onChange={(e) =>
                    setFormData({ ...formData, hora_fim: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(
                  value: "pendente" | "confirmada" | "cancelada"
                ) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pending</SelectItem>
                  <SelectItem value="confirmada">Confirmed</SelectItem>
                  <SelectItem value="cancelada">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedReserva(null);
                setFormData({
                  usuario_id: "",
                  sala_id: "",
                  data_reserva: "",
                  hora_inicio: "",
                  hora_fim: "",
                  status: "pendente",
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Reservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete reservation{" "}
              <span className="font-semibold">
                #{selectedReserva?.reserva_id}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedReserva(null);
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
