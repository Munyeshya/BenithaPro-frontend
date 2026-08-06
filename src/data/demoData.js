export const demoCategories = [
  {
    id: 1,
    name: 'Bridal Makeup',
    description: 'Elegant, camera-ready artistry for every part of your wedding celebration.',
    packages: [
      {
        id: 101,
        category_name: 'Bridal Makeup',
        name: 'Bridal Studio Glam',
        short_description: 'A refined bridal look created in studio with premium products and lasting finish.',
        price: 150000,
        duration_minutes: 150,
        maximum_people: 1,
        is_featured: true,
        images: [],
      },
      {
        id: 102,
        category_name: 'Bridal Makeup',
        name: 'Bride & Matron On-Location',
        short_description: 'Luxury on-location makeup for the bride and matron without day-long touch-ups.',
        price: 220000,
        duration_minutes: 210,
        maximum_people: 2,
        is_featured: true,
        images: [],
      },
      {
        id: 103,
        category_name: 'Bridal Makeup',
        name: 'Wedding Day VIP',
        short_description: 'Full wedding-day beauty support with ceremony and reception touch-ups.',
        price: 320000,
        duration_minutes: 480,
        maximum_people: 2,
        is_featured: false,
        images: [],
      },
    ],
  },
  {
    id: 2,
    name: 'Event Glam',
    description: 'Polished signature looks for celebrations, portraits, and special occasions.',
    packages: [
      {
        id: 201,
        category_name: 'Event Glam',
        name: 'Soft Glam',
        short_description: 'Luminous skin, softly defined eyes, and an elegant natural finish.',
        price: 50000,
        duration_minutes: 90,
        maximum_people: 1,
        is_featured: false,
        images: [],
      },
      {
        id: 202,
        category_name: 'Event Glam',
        name: 'Full Glam',
        short_description: 'A bold, flawless finish tailored for evening events and photography.',
        price: 70000,
        duration_minutes: 120,
        maximum_people: 1,
        is_featured: false,
        images: [],
      },
      {
        id: 203,
        category_name: 'Event Glam',
        name: 'Editorial Session',
        short_description: 'Creative makeup direction for campaigns, shoots, and statement portraits.',
        price: 90000,
        duration_minutes: 150,
        maximum_people: 1,
        is_featured: false,
        images: [],
      },
    ],
  },
];

export const demoPaymentMethods = [
  { id: 1, name: 'MTN Mobile Money', account_name: 'BenithaMakeup Pro', account_number: '+250 795 509 978' },
  { id: 2, name: 'Bank Transfer', account_name: 'BenithaMakeup Pro', account_number: 'Account details on request' },
];

export const demoSchedule = {
  opening_time: '08:00',
  closing_time: '18:00',
  timeline_segments: [
    { type: 'available', label: '08:00 - 12:30', width_percent: 45, reason: 'Open for booking' },
    { type: 'blocked', label: '12:30 - 13:30', width_percent: 10, reason: 'Studio break' },
    { type: 'available', label: '13:30 - 18:00', width_percent: 45, reason: 'Open for booking' },
  ],
};
