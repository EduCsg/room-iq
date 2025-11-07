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
import { Reserva } from "@/lib/types";
import { Calendar, ArrowLeft, Plus, Clock, DoorOpen, User } from "lucide-react";

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getReservas()
      .then((data) => setReservas(data))
      .catch((error) => console.error("Error loading reservas:", error))
      .finally(() => setLoading(false));
  }, []);

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
        <Button>
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
                      {new Date(reserva.data_reserva).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </CardDescription>
                  </div>
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
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {new Date(reserva.hora_inicio).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {reserva.hora_fim &&
                          ` - ${new Date(reserva.hora_fim).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}`}
                      </div>
                    </div>
                  </div>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Reservation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
