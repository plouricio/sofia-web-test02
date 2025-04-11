import React, { useState } from "react";
import { Grid } from "@/components/Grid/Grid";
import {
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { Column } from "@/lib/store/gridStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DynamicForm, {
  SectionConfig,
} from "@/components/DynamicForm/DynamicForm";
import { z } from "zod";

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

// Mock data for equipment that can be assigned to cuarteles
const equipmentData = [
  {
    id: "eq1",
    name: "Tractor John Deere",
    type: "Maquinaria pesada",
    status: "Disponible",
    lastMaintenance: "2023-05-12"
  },
  {
    id: "eq2",
    name: "Sistema de riego automatizado",
    type: "Infraestructura",
    status: "En uso",
    lastMaintenance: "2023-08-23"
  },
  {
    id: "eq3",
    name: "Cosechadora",
    type: "Maquinaria pesada",
    status: "Mantenimiento",
    lastMaintenance: "2023-11-05"
  },
  {
    id: "eq4",
    name: "Dron de monitoreo",
    type: "Tecnología",
    status: "Disponible",
    lastMaintenance: "2024-01-18"
  },
  {
    id: "eq5",
    name: "Sistema de fertilización",
    type: "Infraestructura",
    status: "En uso",
    lastMaintenance: "2023-07-30"
  }
];

// Equipment grid columns
const equipmentColumns = [
  {
    id: "name",
    header: "Nombre",
    accessor: "name"
  },
  {
    id: "type",
    header: "Tipo",
    accessor: "type"
  },
  {
    id: "status",
    header: "Estado",
    accessor: "status"
  },
  {
    id: "lastMaintenance",
    header: "Último mantenimiento",
    accessor: "lastMaintenance"
  }
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

// Form configuration for adding new cuartel
const formSections: SectionConfig[] = [
  {
    id: "cuartel-info",
    title: "Información del Cuartel",
    description: "Ingrese los datos del nuevo cuartel",
    fields: [
      {
        id: "barracks",
        type: "text",
        label: "Barracks",
        name: "barracks",
        placeholder: "Nombre del cuartel",
        required: true,
      },
      {
        id: "species",
        type: "text",
        label: "Species",
        name: "species",
        placeholder: "Especie",
        required: true,
      },
      {
        id: "variety",
        type: "text",
        label: "Variety",
        name: "variety",
        placeholder: "Variedad",
        required: true,
      },
      {
        id: "phenologicalState",
        type: "text",
        label: "Phenological State",
        name: "phenologicalState",
        placeholder: "Estado fenológico",
        required: true,
      },
      {
        id: "state",
        type: "checkbox",
        label: "State",
        name: "state",
        required: true,
      },
    ],
  },
  {
    id: "equipment-section",
    title: "Equipamiento Asignado",
    description: "Seleccione el equipamiento que desea asignar a este cuartel",
    fields: [
      {
        id: "assignedEquipment",
        type: "selectableGrid",
        label: "Equipamiento Disponible",
        name: "assignedEquipment",
        required: false,
        helperText: "Seleccione uno o más equipos para asignar al cuartel",
        gridConfig: {
          columns: equipmentColumns,
          data: equipmentData,
          multiSelect: true,
          maxHeight: 300,
          searchable: true
        }
      }
    ]
  }
];

// Form validation schema
const formValidationSchema = z.object({
  barracks: z.string().min(1, { message: "Barracks is required" }),
  species: z.string().min(1, { message: "Species is required" }),
  variety: z.string().min(1, { message: "Variety is required" }),
  phenologicalState: z
    .string()
    .min(1, { message: "Phenological State is required" }),
  state: z.boolean(),
  assignedEquipment: z.array(z.any()).optional()
});

const Cuarteles = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddCuartel = (data: any) => {
    console.log("Nuevo cuartel:", data);
    setIsDialogOpen(false);
    // Aquí iría la lógica para añadir el cuartel a la base de datos
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cuarteles</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cuartel
        </Button>
      </div>

      {/* Grid using Zustand store - with gridId for the cuartel grid */}
      <Grid
        data={cuartelesData}
        columns={columns}
        title="Cuarteles"
        expandableContent={expandableContent}
        gridId="cuarteles" // Unique identifier for this grid
      />

      {/* Dialog for adding a new cuartel */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Cuartel</DialogTitle>
            <DialogDescription>
              Complete el formulario para agregar un nuevo cuartel al sistema.
            </DialogDescription>
          </DialogHeader>
          <DynamicForm
            sections={formSections}
            onSubmit={handleAddCuartel}
            validationSchema={formValidationSchema}
            defaultValues={{
              state: false,
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cuarteles;
