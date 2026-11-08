export const CATEGORIES = [
  { id: 'books', name: 'Books & Notes', icon: 'BookOpen', count: 42, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'electronics', name: 'Electronics & Gadgets', icon: 'Laptop', count: 28, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'hostel', name: 'Hostel Essentials', icon: 'Home', count: 35, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'engineering', name: 'Lab & Engineering Kits', icon: 'Compass', count: 19, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'cycles', name: 'Cycles & Mobility', icon: 'Bike', count: 14, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  { id: 'stationery', name: 'Stationery & Drafters', icon: 'PenTool', count: 23, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { id: 'fashion', name: 'College Uniform & Coats', icon: 'Shirt', count: 16, color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  { id: 'sports', name: 'Sports & Fitness', icon: 'Dumbbell', count: 11, color: 'bg-orange-50 text-orange-600 border-orange-200' },
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Casio FX-991EX Classwiz Scientific Calculator',
    description: 'High-speed scientific calculator in mint condition. Perfect for Engineering Mathematics, EE, and GATE preparation. All buttons smooth, comes with slide-on hard case and fresh battery.',
    price: 850,
    originalPrice: 1595,
    category: 'engineering',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'user-abes-1',
      name: 'Aryan Sharma',
      email: 'aryan.21b0101001@abes.ac.in',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      hostel: 'Aryabhatta Boys Hostel (BH-2)',
      rating: 4.9,
      phone: '+91 98765 43210',
      verifiedStudent: true
    },
    location: 'BH-2 Room 314, ABES Campus',
    isFeatured: true,
    createdAt: '2026-11-04T10:30:00.000Z',
    status: 'active',
    views: 142
  },
  {
    id: 'prod-2',
    title: 'Omega Mini Drafter with Cover & Steel Clips',
    description: 'Engineering Graphics & Design mini drafter with dual scale. Essential for 1st & 2nd semester mechanical drawing. Smooth knob rotation and crack-free transparent ruler arms.',
    price: 320,
    originalPrice: 750,
    category: 'stationery',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'user-abes-2',
      name: 'Priya Verma',
      email: 'priya.22b0201045@abes.ac.in',
      department: 'Information Technology',
      year: '2nd Year',
      hostel: 'Kalpana Chawla Girls Hostel (GH-1)',
      rating: 4.8,
      phone: '+91 97654 32109',
      verifiedStudent: true
    },
    location: 'GH-1 Reception, ABES Ghaziabad',
    isFeatured: true,
    createdAt: '2026-11-03T14:15:00.000Z',
    status: 'active',
    views: 98
  },
  {
    id: 'prod-3',
    title: 'Hero Sprint 21-Speed Mountain Gear Bicycle',
    description: 'Black & orange cycle with dual disc brakes, front suspension, and water bottle holder. Used for daily commuting to campus and Crossings Republik. Fully tuned up last week.',
    price: 3800,
    originalPrice: 8900,
    category: 'cycles',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'user-abes-3',
      name: 'Rohan Gupta',
      email: 'rohan.20b0301089@abes.ac.in',
      department: 'Mechanical Engineering',
      year: '4th Year',
      hostel: 'Day Scholar (Lal Kuan)',
      rating: 5.0,
      phone: '+91 96543 21098',
      verifiedStudent: true
    },
    location: 'Main Gate Parking, ABES Engineering College',
    isFeatured: true,
    createdAt: '2026-11-05T08:00:00.000Z',
    status: 'active',
    views: 265
  },
  {
    id: 'prod-4',
    title: 'Symphony Personal Room Cooler (Hostel Approved)',
    description: '20L water tank honeycomb pad cooler with i-Pure multi-stage air purification. Super low power consumption, quiet operation, perfect for hostel summer semesters. Clean and ready to use.',
    price: 1950,
    originalPrice: 5499,
    category: 'hostel',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'user-abes-4',
      name: 'Aditya Srivastava',
      email: 'aditya.21b0102112@abes.ac.in',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      hostel: 'Ramanujan Hostel (BH-3)',
      rating: 4.7,
      phone: '+91 95432 10987',
      verifiedStudent: true
    },
    location: 'BH-3 Common Hall, ABES Campus',
    isFeatured: true,
    createdAt: '2026-11-04T18:45:00.000Z',
    status: 'active',
    views: 184
  },
  {
    id: 'prod-5',
    title: 'Introduction to Algorithms (CLRS 3rd Edition)',
    description: 'The Bible of Data Structures & Algorithms by Cormen, Leiserson, Rivest, Stein. Genuine PHI edition, no torn pages, minimal pencil markings in dynamic programming chapters.',
    price: 490,
    originalPrice: 1250,
    category: 'books',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'user-abes-1',
      name: 'Aryan Sharma',
      email: 'aryan.21b0101001@abes.ac.in',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      hostel: 'Aryabhatta Boys Hostel (BH-2)',
      rating: 4.9,
      phone: '+91 98765 43210',
      verifiedStudent: true
    },
    location: 'Bhabha Block Library Area, ABES Ghaziabad',
    isFeatured: false,
    createdAt: '2026-11-05T09:10:00.000Z',
    status: 'active',
    views: 112
  },
  {
    id: 'prod-6',
    title: 'Pigeon 1.5L Stainless Steel Electric Kettle (600W)',
    description: 'Quick-boil electric kettle, ideal for Maggi, tea, oats, and boiling water in hostel rooms. Auto shut-off safety protection, cool-touch handle, corded base.',
    price: 420,
    originalPrice: 1095,
    category: 'hostel',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'user-abes-5',
      name: 'Sneha Patel',
      email: 'sneha.22b0401067@abes.ac.in',
      department: 'Electronics & Communication',
      year: '2nd Year',
      hostel: 'Sarojini Girls Hostel (GH-2)',
      rating: 4.9,
      phone: '+91 94321 09876',
      verifiedStudent: true
    },
    location: 'GH-2 Gate, ABES Campus',
    isFeatured: false,
    createdAt: '2026-11-04T12:00:00.000Z',
    status: 'active',
    views: 75
  },
  {
    id: 'prod-7',
    title: 'ABES Pure White Lab Coat (Size 38 / M)',
    description: 'Cotton fabric lab apron with embroidered college standard finish, 3 deep pockets, clean and washed. Required for Chemistry Lab and Workshop practices.',
    price: 180,
    originalPrice: 450,
    category: 'fashion',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'user-abes-2',
      name: 'Priya Verma',
      email: 'priya.22b0201045@abes.ac.in',
      department: 'Information Technology',
      year: '2nd Year',
      hostel: 'Kalpana Chawla Girls Hostel (GH-1)',
      rating: 4.8,
      phone: '+91 97654 32109',
      verifiedStudent: true
    },
    location: 'Chemistry Lab Corridor / Canteen',
    isFeatured: false,
    createdAt: '2026-11-05T07:30:00.000Z',
    status: 'active',
    views: 64
  },
  {
    id: 'prod-8',
    title: 'Portronics Foldable Ergonomic Laptop Stand',
    description: '7-level height adjustable aluminum alloy stand. Prevents neck strain during long coding assignments. Sturdy non-slip silicone pads and portable carrying pouch.',
    price: 350,
    originalPrice: 899,
    category: 'electronics',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'user-abes-6',
      name: 'Kunal Joshi',
      email: 'kunal.23b0103021@abes.ac.in',
      department: 'CSE (Data Science)',
      year: '1st Year',
      hostel: 'Aryabhatta Boys Hostel (BH-1)',
      rating: 4.6,
      phone: '+91 93210 98765',
      verifiedStudent: true
    },
    location: 'Cafeteria Ground Floor, ABES',
    isFeatured: true,
    createdAt: '2026-11-05T11:20:00.000Z',
    status: 'active',
    views: 153
  },
  {
    id: 'prod-9',
    title: 'Cosco Rio Rubber Basketball (Size 7) + Hand Pump',
    description: 'Official size and weight outdoor basketball with deep pebble channel for maximum grip. Free air pump and needle included. Used twice at the college basketball court.',
    price: 290,
    originalPrice: 650,
    category: 'sports',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'user-abes-3',
      name: 'Rohan Gupta',
      email: 'rohan.20b0301089@abes.ac.in',
      department: 'Mechanical Engineering',
      year: '4th Year',
      hostel: 'Day Scholar (Lal Kuan)',
      rating: 5.0,
      phone: '+91 96543 21098',
      verifiedStudent: true
    },
    location: 'Sports Ground / Gym, ABES',
    isFeatured: false,
    createdAt: '2026-11-02T16:00:00.000Z',
    status: 'active',
    views: 89
  }
];

export const INITIAL_USERS = [
  {
    id: 'user-abes-1',
    name: 'Aryan Sharma',
    email: 'aryan.21b0101001@abes.ac.in',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    rollNumber: '2100320100045',
    phone: '+91 98765 43210',
    hostel: 'Aryabhatta Boys Hostel (BH-2)',
    role: 'student',
    status: 'active',
    joinedDate: 'Aug 2021',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-abes-2',
    name: 'Priya Verma',
    email: 'priya.22b0201045@abes.ac.in',
    department: 'Information Technology',
    year: '2nd Year',
    rollNumber: '2200320130089',
    phone: '+91 97654 32109',
    hostel: 'Kalpana Chawla Girls Hostel (GH-1)',
    role: 'student',
    status: 'active',
    joinedDate: 'Aug 2022',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-abes-admin',
    name: 'ABES Campus Admin',
    email: 'admin.council@abes.ac.in',
    department: 'Student Affairs & Marketplace Council',
    year: 'Faculty / Admin',
    rollNumber: 'EMP-ABES-8821',
    phone: '+91 98112 34567',
    hostel: 'Admin Block, ABES Ghaziabad',
    role: 'admin',
    status: 'active',
    joinedDate: 'Jan 2020',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CHATS = [
  {
    id: 'chat-1',
    participant: {
      id: 'user-abes-3',
      name: 'Rohan Gupta',
      email: 'rohan.20b0301089@abes.ac.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      department: 'Mechanical Engineering (4th Yr)'
    },
    productId: 'prod-3',
    productTitle: 'Hero Sprint 21-Speed Mountain Gear Bicycle',
    productPrice: 3800,
    productImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=80',
    messages: [
      { id: 'm1', sender: 'user-abes-3', text: 'Hey Aryan! Saw you were checking out the cycle.', time: '10:14 AM', isSelf: false },
      { id: 'm2', sender: 'me', text: 'Yes brother! Is the gearing working smoothly? Any chain drops?', time: '10:16 AM', isSelf: true },
      { id: 'm3', sender: 'user-abes-3', text: 'Smooth as butter! I got it greased at Lal Kuan cycle shop last Friday. Can test ride it at main gate.', time: '10:18 AM', isSelf: false },
      { id: 'm4', sender: 'me', text: 'Awesome! Can we meet around 4:30 PM near the campus canteen?', time: '10:20 AM', isSelf: true }
    ],
    unread: 0
  },
  {
    id: 'chat-2',
    participant: {
      id: 'user-abes-2',
      name: 'Priya Verma',
      email: 'priya.22b0201045@abes.ac.in',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      department: 'IT (2nd Yr)'
    },
    productId: 'prod-2',
    productTitle: 'Omega Mini Drafter with Cover & Steel Clips',
    productPrice: 320,
    productImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&auto=format&fit=crop&q=80',
    messages: [
      { id: 'm20', sender: 'me', text: 'Hi Priya, does the drafter include the drawing sheet clips?', time: 'Yesterday', isSelf: true },
      { id: 'm21', sender: 'user-abes-2', text: 'Yes, 4 metal clips plus the protective zip bag included!', time: 'Yesterday', isSelf: false }
    ],
    unread: 1
  }
];
