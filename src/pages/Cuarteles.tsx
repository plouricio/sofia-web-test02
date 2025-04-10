import React from "react";
import Grid from "@/components/Grid/Grid";
import { Building2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Column } from "@/contexts/GridContext";

// Mock data for cuarteles
const cuartelesData = [
  {
    id: 1,
    nombre: "Cuartel Central",
    ubicacion: "Ciudad Capital",
    capacidad: 250,
    comandante: "Cnel. Martínez",
    estado: "Activo",
    personal: 210,
    vehiculos: 45,
    fechaFundacion: "1985-06-12",
    ultimaRenovacion: "2019-03-15",
  },
  {
    id: 2,
    nombre: "Cuartel Norte",
    ubicacion: "Provincia Norte",
    capacidad: 180,
    comandante: "Tcnel. Rodríguez",
    estado: "Activo",
    personal: 165,
    vehiculos: 32,
    fechaFundacion: "1992-11-05",
    ultimaRenovacion: "2020-07-22",
  },
  {
    id: 3,
    nombre: "Cuartel Sur",
    ubicacion: "Provincia Sur",
    capacidad: 120,
    comandante: "Mayor Sánchez",
    estado: "En renovación",
    personal: 85,
    vehiculos: 18,
    fechaFundacion: "1998-04-30",
    ultimaRenovacion: "2018-09-10",
  },
  {
    id: 4,
    nombre: "Cuartel Este",
    ubicacion: "Provincia Este",
    capacidad: 150,
    comandante: "Tcnel. Gómez",
    estado: "Activo",
    personal: 142,
    vehiculos: 28,
    fechaFundacion: "1990-02-18",
    ultimaRenovacion: "2021-05-03",
  },
  {
    id: 5,
    nombre: "Cuartel Oeste",
    ubicacion: "Provincia Oeste",
    capacidad: 200,
    comandante: "Cnel. Pérez",
    estado: "Inactivo",
    personal: 0,
    vehiculos: 5,
    fechaFundacion: "1988-09-25",
    ultimaRenovacion: "2017-11-30",
  },
  {
    id: 6,
    nombre: "Base Montaña",
    ubicacion: "Cordillera Central",
    capacidad: 90,
    comandante: "Cap. Díaz",
    estado: "Activo",
    personal: 82,
    vehiculos: 15,
    fechaFundacion: "2005-12-07",
    ultimaRenovacion: "2022-01-15",
  },
  {
    id: 7,
    nombre: "Base Costera",
    ubicacion: "Costa Atlántica",
    capacidad: 110,
    comandante: "Mayor López",
    estado: "Activo",
    personal: 98,
    vehiculos: 22,
    fechaFundacion: "2001-08-14",
    ultimaRenovacion: "2021-10-05",
  },
  {
    id: 8,
    nombre: "Cuartel Frontera",
    ubicacion: "Zona Fronteriza",
    capacidad: 160,
    comandante: "Tcnel. Ramírez",
    estado: "En renovación",
    personal: 120,
    vehiculos: 25,
    fechaFundacion: "1995-05-20",
    ultimaRenovacion: "2019-08-12",
  },
];

// Render function for the estado column
const renderEstado = (value: string) => {
  switch (value) {
    case "Activo":
      return (
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          <span>Activo</span>
        </div>
      );
    case "Inactivo":
      return (
        <div className="flex items-center">
          <XCircle className="h-4 w-4 text-red-500 mr-2" />
          <span>Inactivo</span>
        </div>
      );
    case "En renovación":
      return (
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
          <span>En renovación</span>
        </div>
      );
    default:
      return value;
  }
};

// Column configuration for the grid
const columns: Column[] = [
  {
    id: "id",
    header: "ID",
    accessor: "id",
    visible: true,
    sortable: true,
  },
  {
    id: "nombre",
    header: "Nombre",
    accessor: "nombre",
    visible: true,
    sortable: true,
    groupable: true,
  },
  {
    id: "ubicacion",
    header: "Ubicación",
    accessor: "ubicacion",
    visible: true,
    sortable: true,
    groupable: true,
  },
  {
    id: "capacidad",
    header: "Capacidad",
    accessor: "capacidad",
    visible: true,
    sortable: true,
  },
  {
    id: "comandante",
    header: "Comandante",
    accessor: "comandante",
    visible: true,
    sortable: true,
  },
  {
    id: "estado",
    header: "Estado",
    accessor: "estado",
    visible: true,
    sortable: true,
    groupable: true,
    render: renderEstado,
  },
  {
    id: "personal",
    header: "Personal",
    accessor: "personal",
    visible: true,
    sortable: true,
  },
  {
    id: "vehiculos",
    header: "Vehículos",
    accessor: "vehiculos",
    visible: true,
    sortable: true,
  },
  {
    id: "fechaFundacion",
    header: "Fecha Fundación",
    accessor: "fechaFundacion",
    visible: true,
    sortable: true,
  },
  {
    id: "ultimaRenovacion",
    header: "Última Renovación",
    accessor: "ultimaRenovacion",
    visible: true,
    sortable: true,
  },
];

// Expandable content for each row
const expandableContent = (row: any) => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-2">{row.nombre}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p>
          <strong>Ubicación:</strong> {row.ubicacion}
        </p>
        <p>
          <strong>Capacidad:</strong> {row.capacidad} personas
        </p>
        <p>
          <strong>Comandante:</strong> {row.comandante}
        </p>
        <p>
          <strong>Estado:</strong> {row.estado}
        </p>
      </div>
      <div>
        <p>
          <strong>Personal actual:</strong> {row.personal} personas
        </p>
        <p>
          <strong>Vehículos:</strong> {row.vehiculos} unidades
        </p>
        <p>
          <strong>Fecha de fundación:</strong> {row.fechaFundacion}
        </p>
        <p>
          <strong>Última renovación:</strong> {row.ultimaRenovacion}
        </p>
      </div>
    </div>
  </div>
);

const Cuarteles = () => {
  return (
    <div className="p-6 bg-background">
      <div className="flex items-center mb-6">
        <Building2 className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Cuarteles</h1>
      </div>
      <Grid
        data={cuartelesData}
        columns={columns}
        title="Listado de Cuarteles"
        expandableContent={expandableContent}
      />
    </div>
  );
};

export default Cuarteles;
