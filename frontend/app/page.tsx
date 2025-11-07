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
import { Bloco, Sala, Equipamento, Usuario, Reserva } from "@/lib/types";
import {
  Users,
  Building2,
  Package,
  Calendar,
  DoorOpen,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getBlocos(),
      api.getSalas(),
      api.getEquipamentos(),
      api.getUsuarios(),
      api.getReservas(),
    ])
      .then(([b, s, e, u, r]) => {
        setBlocos(b);
        setSalas(s);
        setEquipamentos(e);
        setUsuarios(u);
        setReservas(r);
      })
      .catch((error) => {
        console.error("Error loading dashboard data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const confirmedReservas = reservas.filter((r) => r.status === "confirmada");
  const totalEquipmentCount = equipamentos.reduce(
    (sum, eq) => sum + eq.quantidade,
    0
  );

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">RoomIQ Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your room management system
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Link href="/blocos">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buildings</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blocos.length}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/salas">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rooms</CardTitle>
              <DoorOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salas.length}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/equipamentos">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEquipmentCount}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {equipamentos.length} types <ArrowRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/usuarios">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.length}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reservas">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reservations
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservas.length}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {confirmedReservas.length} confirmed{" "}
                <ArrowRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Reservations
            </CardTitle>
            <CardDescription>
              Latest {Math.min(5, reservas.length)} reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reservas.length > 0 ? (
              <div className="space-y-4">
                {reservas.slice(0, 5).map((reserva) => (
                  <div
                    key={reserva.reserva_id}
                    className="flex items-start justify-between border-b pb-3 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {reserva.sala_nome || "Unknown Room"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reserva.usuario_nome || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(reserva.data_reserva).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
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
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No reservations yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5" />
              Rooms by Building
            </CardTitle>
            <CardDescription>Distribution of rooms</CardDescription>
          </CardHeader>
          <CardContent>
            {blocos.length > 0 ? (
              <div className="space-y-4">
                {blocos.map((bloco) => {
                  const roomCount = salas.filter(
                    (s) => s.bloco_id === bloco.bloco_id
                  ).length;
                  return (
                    <div
                      key={bloco.bloco_id}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{bloco.nome}</p>
                        {bloco.descricao && (
                          <p className="text-xs text-muted-foreground">
                            {bloco.descricao}
                          </p>
                        )}
                      </div>
                      <div className="text-2xl font-bold">{roomCount}</div>
                    </div>
                  );
                })}
                {blocos.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No buildings found
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No buildings available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Equipment Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Equipment Inventory
          </CardTitle>
          <CardDescription>
            Available equipment across all rooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {equipamentos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipamentos.map((equip) => (
                <div
                  key={equip.equipamento_id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{equip.nome}</p>
                    <span className="text-sm font-bold">
                      {equip.quantidade}x
                    </span>
                  </div>
                  {equip.descricao && (
                    <p className="text-xs text-muted-foreground">
                      {equip.descricao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No equipment available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
