
export type GuestFrom = "Novio y Novia" | "Novio" | "Novia" | "Amigo" | "Amiga" | "Familiar" | "Otro";

export type GuestRelationship = "Padre" | "Madre" | "Hermano" | "Hermana" | "Tio" | "Tia" | "Sobrino" | "Sobrina" | "Primo" | "Prima" | "Amigo" | "Amiga" | "Familiar" | "Otro";

export type GuestLanguage = "Español" | "Inglés" | "Portugués" | "Francés" | "Alemán" | "Italiano" | "Otro";

export interface IGuest {
  _id?: string;
  guestFrom: GuestFrom;
  guestType?: string;
  guestRelationship?: GuestRelationship;
  guestName: string;
  guestPassesNumberToRecibe: number;
  guestPeopleNumber: number;
  guestInvitation: boolean;
  guestWouldAccept: boolean;
  guestExpectationAssistant?: number;
  priority?: number | null;
  guestCanBeDeleted: boolean;
  guestInvitationName: string;
  guestPrimaryContact: number;
  guestSecondaryContact?: number | null;
  guestPhysicalInvitation: boolean;
  guestWasInvited: boolean;
  guestInvitationResponse: boolean;
  guestParticipation?: number;
  guestLanguage?: GuestLanguage;
  guestInvitationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Tipo para crear un nuevo guest (sin _id)
export type CreateGuestInput = Omit<IGuest, '_id' | 'createdAt' | 'updatedAt'>;

// Tipo para actualizar un guest (todas las propiedades opcionales excepto _id)
export type UpdateGuestInput = Partial<Omit<IGuest, '_id' | 'createdAt' | 'updatedAt'>>;

// Tipo para las respuestas de la API
export interface GuestResponse {
  success: boolean;
  data?: IGuest | IGuest[];
  message?: string;
  error?: string;
} 