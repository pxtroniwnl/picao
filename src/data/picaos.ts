export interface Field {
  id: string
  name: string
  barrio: string
  photoUrl: string
  format: string
  pricePerHour: number
  hours: string[]
}

export interface Picao {
  id: string
  code: string
  fieldId: string
  date: string
  time: string
  duration: string
  hoursCount: number
  format: string
  slots: number
  totalSlots: number
  price: number
  urgent: boolean
  map: { x: number; y: number }
  distanceKm: number
  organizer: {
    name: string
    rating: number
    avatar: string
  }
  players: string[]
  status?: 'abierto' | 'confirmado' | 'lleno' | 'jugado'
  visibility?: 'publico' | 'privado'
  createdByMe?: boolean
  joined?: boolean
}

export const FORMAT_PLAYERS: Record<string, number> = {
  '5v5': 10,
  '7v7': 14,
  '11v11': 22,
}
export const FORMAT_LABEL: Record<string, string> = {
  '5v5': 'Fútbol 5',
  '7v7': 'Fútbol 7',
  '11v11': 'Fútbol 11',
}

export const FIELDS: Record<string, Field> = {
  f1: {
    id: 'f1',
    name: 'Cancha La Bombonera',
    barrio: 'Los Caracoles',
    photoUrl:
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    format: '5v5',
    pricePerHour: 100000,
    hours: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'],
  },
  f2: {
    id: 'f2',
    name: 'Polideportivo Chambacú',
    barrio: 'Chambacú',
    photoUrl:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
    format: '11v11',
    pricePerHour: 220000,
    hours: ['4:00 PM', '5:00 PM', '6:00 PM', '8:00 PM'],
  },
  f3: {
    id: 'f3',
    name: 'Cancha El Country',
    barrio: 'El Country',
    photoUrl:
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=80',
    format: '7v7',
    pricePerHour: 140000,
    hours: ['5:00 PM', '7:00 PM', '9:00 PM'],
  },
  f4: {
    id: 'f4',
    name: 'Cancha Manga',
    barrio: 'Manga',
    photoUrl:
      'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
    format: '7v7',
    pricePerHour: 130000,
    hours: ['3:00 PM', '4:00 PM', '6:00 PM', '8:00 PM', '10:00 PM'],
  },
  f5: {
    id: 'f5',
    name: 'Cancha Bocagrande',
    barrio: 'Bocagrande',
    photoUrl:
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    format: '5v5',
    pricePerHour: 110000,
    hours: ['6:00 PM', '7:30 PM', '9:00 PM'],
  },
}

export const MOCK_PICAOS: Picao[] = [
  {
    id: 'p1',
    code: 'PCO-1042',
    fieldId: 'f1',
    date: 'Hoy',
    time: '8:00 PM',
    duration: '1 Hora',
    hoursCount: 1,
    format: '5v5',
    slots: 8,
    totalSlots: 10,
    price: 11250,
    urgent: true,
    map: { x: 42, y: 58 },
    distanceKm: 1.2,
    organizer: { name: 'Carlos "El Pibe"', rating: 4.9, avatar: 'https://i.pravatar.cc/100?img=33' },
    players: [
      'https://i.pravatar.cc/100?img=11',
      'https://i.pravatar.cc/100?img=12',
      'https://i.pravatar.cc/100?img=13',
      'https://i.pravatar.cc/100?img=14',
      'https://i.pravatar.cc/100?img=15',
      'https://i.pravatar.cc/100?img=16',
      'https://i.pravatar.cc/100?img=17',
      'https://i.pravatar.cc/100?img=18',
    ],
    status: 'abierto',
    createdByMe: true,
    visibility: 'publico',
  },
  {
    id: 'p2',
    code: 'PCO-2087',
    fieldId: 'f5',
    date: 'Mañana',
    time: '7:30 PM',
    duration: '1.5 Horas',
    hoursCount: 1.5,
    format: '5v5',
    slots: 12,
    totalSlots: 14,
    price: 12250,
    urgent: true,
    map: { x: 70, y: 38 },
    distanceKm: 2.4,
    organizer: { name: 'Kevin', rating: 4.5, avatar: 'https://i.pravatar.cc/100?img=59' },
    players: Array(12).fill(0).map((_, i) => `https://i.pravatar.cc/100?img=${20 + i}`),
    status: 'abierto',
    joined: true,
  },
  {
    id: 'p3',
    code: 'PCO-3361',
    fieldId: 'f2',
    date: 'Jueves',
    time: '6:00 PM',
    duration: '1 Hora',
    hoursCount: 1,
    format: '11v11',
    slots: 10,
    totalSlots: 22,
    price: 11250,
    urgent: false,
    map: { x: 28, y: 30 },
    distanceKm: 3.1,
    organizer: { name: 'Lucho', rating: 4.2, avatar: 'https://i.pravatar.cc/100?img=15' },
    players: Array(10).fill(0).map((_, i) => `https://i.pravatar.cc/100?img=${40 + i}`),
    status: 'abierto',
    joined: true,
  },
  {
    id: 'p4',
    code: 'PCO-4115',
    fieldId: 'f4',
    date: 'Sábado',
    time: '4:00 PM',
    duration: '2 Horas',
    hoursCount: 2,
    format: '7v7',
    slots: 14,
    totalSlots: 14,
    price: 10535,
    urgent: false,
    map: { x: 60, y: 72 },
    distanceKm: 4.0,
    organizer: { name: 'El Profe', rating: 5.0, avatar: 'https://i.pravatar.cc/100?img=68' },
    players: Array(14).fill(0).map((_, i) => `https://i.pravatar.cc/100?img=${50 + i}`),
    status: 'lleno',
    createdByMe: true,
    visibility: 'privado',
  },
  {
    id: 'p5',
    code: 'PCO-0921',
    fieldId: 'f3',
    date: 'Sáb pasado',
    time: '5:00 PM',
    duration: '1 Hora',
    hoursCount: 1,
    format: '7v7',
    slots: 14,
    totalSlots: 14,
    price: 11250,
    urgent: false,
    map: { x: 40, y: 40 },
    distanceKm: 2.0,
    organizer: { name: 'Carlos "El Pibe"', rating: 4.9, avatar: 'https://i.pravatar.cc/100?img=33' },
    players: Array(14).fill(0).map((_, i) => `https://i.pravatar.cc/100?img=${10 + i}`),
    status: 'jugado',
  },
  {
    id: 'p6',
    code: 'PCO-0744',
    fieldId: 'f1',
    date: 'Hace 1 sem',
    time: '8:00 PM',
    duration: '1 Hora',
    hoursCount: 1,
    format: '5v5',
    slots: 10,
    totalSlots: 10,
    price: 11250,
    urgent: false,
    map: { x: 42, y: 58 },
    distanceKm: 1.2,
    organizer: { name: 'Kevin', rating: 4.5, avatar: 'https://i.pravatar.cc/100?img=59' },
    players: Array(10).fill(0).map((_, i) => `https://i.pravatar.cc/100?img=${30 + i}`),
    status: 'jugado',
  },
  {
    id: 'p7',
    code: 'PCO-0610',
    fieldId: 'f4',
    date: '12 jun',
    time: '6:00 PM',
    duration: '2 Horas',
    hoursCount: 2,
    format: '7v7',
    slots: 14,
    totalSlots: 14,
    price: 10535,
    urgent: false,
    map: { x: 60, y: 72 },
    distanceKm: 4.0,
    organizer: { name: 'El Profe', rating: 5.0, avatar: 'https://i.pravatar.cc/100?img=68' },
    players: Array(14).fill(0).map((_, i) => `https://i.pravatar.cc/100?img=${44 + i}`),
    status: 'jugado',
  },
]
