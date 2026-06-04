import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 20 Realistic Indian Colleges with varied locations, types, ratings, and fees.
  const colleges = [
    {
      name: "Indian Institute of Technology (IIT) Bombay",
      location: "Mumbai",
      state: "Maharashtra",
      type: "Public",
      rating: 4.9,
      totalFees: 230000,
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000",
      overview: "IIT Bombay is a globally recognized engineering institution, known for its outstanding faculty, state-of-the-art facilities, and vibrant campus life.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 230000 },
          { name: "B.Tech Electrical Engineering", duration: "4 Years", fees: 230000 },
          { name: "M.Tech Data Science", duration: "2 Years", fees: 150000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 2300000, highestPackage: 36700000, placementRate: 98.5 }
        ]
      },
      reviews: {
        create: [
          { author: "Rahul D.", rating: 5.0, comment: "Exceptional peer group and unparalleled research opportunities." },
          { author: "Priya S.", rating: 4.8, comment: "Rigorous academics but very rewarding in the end." }
        ]
      }
    },
    {
      name: "Indian Institute of Technology (IIT) Delhi",
      location: "New Delhi",
      state: "Delhi",
      type: "Public",
      rating: 4.8,
      totalFees: 220000,
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000",
      overview: "Located in the heart of the capital, IIT Delhi is known for its strong alumni network and entrepreneurial ecosystem.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 220000 },
          { name: "B.Tech Mathematics and Computing", duration: "4 Years", fees: 220000 },
          { name: "M.Tech VLSI Design", duration: "2 Years", fees: 140000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 2100000, highestPackage: 35000000, placementRate: 97.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Amit K.", rating: 4.9, comment: "Great startup culture and excellent location." },
          { author: "Sneha M.", rating: 4.7, comment: "Hostel facilities could be improved, but academics are top-notch." }
        ]
      }
    },
    {
      name: "Birla Institute of Technology and Science (BITS)",
      location: "Pilani",
      state: "Rajasthan",
      type: "Private",
      rating: 4.7,
      totalFees: 520000,
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000",
      overview: "BITS Pilani is India's premier private engineering college, known for its zero-attendance policy and flexible curriculum.",
      courses: {
        create: [
          { name: "B.E. Computer Science", duration: "4 Years", fees: 520000 },
          { name: "B.E. Electronics and Instrumentation", duration: "4 Years", fees: 520000 },
          { name: "M.Sc. Economics (Dual Degree)", duration: "5 Years", fees: 520000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 2000000, highestPackage: 32000000, placementRate: 96.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Vikram R.", rating: 4.8, comment: "The freedom to choose your own professors and schedule is amazing." },
          { author: "Neha J.", rating: 4.5, comment: "Fees are on the higher side, but the ROI is worth it." }
        ]
      }
    },
    {
      name: "National Institute of Technology (NIT) Trichy",
      location: "Tiruchirappalli",
      state: "Tamil Nadu",
      type: "Public",
      rating: 4.6,
      totalFees: 170000,
      imageUrl: "https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8?auto=format&fit=crop&q=80&w=1000",
      overview: "NIT Trichy consistently ranks as the best NIT in India, boasting a massive campus and excellent placement records.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 170000 },
          { name: "B.Tech Electronics and Communication", duration: "4 Years", fees: 170000 },
          { name: "MCA", duration: "3 Years", fees: 90000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 1500000, highestPackage: 25000000, placementRate: 95.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Arjun T.", rating: 4.7, comment: "Best NIT with fantastic campus life and clubs." },
          { author: "Divya K.", rating: 4.4, comment: "Weather is a bit hot, but academics are rigorous." }
        ]
      }
    },
    {
      name: "Vellore Institute of Technology (VIT)",
      location: "Vellore",
      state: "Tamil Nadu",
      type: "Private",
      rating: 4.3,
      totalFees: 200000,
      imageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=1000",
      overview: "VIT is a prominent private institution recognized for its diverse student body and strong industry tie-ups.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 200000 },
          { name: "B.Tech Information Technology", duration: "4 Years", fees: 200000 },
          { name: "B.Tech Biotechnology", duration: "4 Years", fees: 200000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 900000, highestPackage: 12000000, placementRate: 92.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Rohan M.", rating: 4.3, comment: "Huge campus with a lot of diversity." },
          { author: "Shruti P.", rating: 4.1, comment: "Strict rules in hostels, but good placement support." }
        ]
      }
    },
    {
      name: "Indian Institute of Technology (IIT) Kanpur",
      location: "Kanpur",
      state: "Uttar Pradesh",
      type: "Public",
      rating: 4.8,
      totalFees: 220000,
      imageUrl: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=1000",
      overview: "IIT Kanpur is famous for its rigorous academic curriculum and extensive research facilities.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 220000 },
          { name: "B.Tech Aerospace Engineering", duration: "4 Years", fees: 220000 },
          { name: "M.Tech Mechanical Engineering", duration: "2 Years", fees: 140000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 2200000, highestPackage: 33000000, placementRate: 98.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Karan S.", rating: 4.9, comment: "Academically very challenging but builds strong fundamentals." },
          { author: "Anjali V.", rating: 4.7, comment: "Great campus and very supportive faculty." }
        ]
      }
    },
    {
      name: "Manipal Institute of Technology (MIT)",
      location: "Manipal",
      state: "Karnataka",
      type: "Private",
      rating: 4.4,
      totalFees: 450000,
      imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1000",
      overview: "MIT Manipal offers a vibrant campus life with top-notch infrastructure and global exposure.",
      courses: {
        create: [
          { name: "B.Tech Computer and Communication Engineering", duration: "4 Years", fees: 450000 },
          { name: "B.Tech Mechatronics", duration: "4 Years", fees: 450000 },
          { name: "B.Tech Data Science", duration: "4 Years", fees: 450000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 1050000, highestPackage: 14000000, placementRate: 91.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Tariq A.", rating: 4.5, comment: "Amazing student clubs and fests." },
          { author: "Riya K.", rating: 4.3, comment: "Expensive, but the overall development and exposure are great." }
        ]
      }
    },
    {
      name: "Delhi Technological University (DTU)",
      location: "New Delhi",
      state: "Delhi",
      type: "Public",
      rating: 4.5,
      totalFees: 190000,
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
      overview: "Formerly DCE, DTU is renowned for its strong engineering programs and outstanding placement records in tech.",
      courses: {
        create: [
          { name: "B.Tech Software Engineering", duration: "4 Years", fees: 190000 },
          { name: "B.Tech Mathematics and Computing", duration: "4 Years", fees: 190000 },
          { name: "B.Tech Mechanical Engineering", duration: "4 Years", fees: 190000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 1600000, highestPackage: 28000000, placementRate: 94.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Saurabh B.", rating: 4.6, comment: "Placements for CS/IT are at par with top IITs." },
          { author: "Megha N.", rating: 4.4, comment: "Large batch size makes it a bit competitive." }
        ]
      }
    },
    {
      name: "International Institute of Information Technology (IIIT) Hyderabad",
      location: "Hyderabad",
      state: "Telangana",
      type: "Public-Private",
      rating: 4.8,
      totalFees: 350000,
      imageUrl: "https://images.unsplash.com/photo-1576092040974-9842a59a973a?auto=format&fit=crop&q=80&w=1000",
      overview: "IIIT Hyderabad is synonymous with top-tier coding culture and world-class research in computer science.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 350000 },
          { name: "B.Tech + MS by Research in CSE", duration: "5 Years", fees: 350000 },
          { name: "B.Tech Electronics and Communication", duration: "4 Years", fees: 350000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 2800000, highestPackage: 42000000, placementRate: 100.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Nikhil P.", rating: 5.0, comment: "The coding culture here is unmatched in India." },
          { author: "Aditi S.", rating: 4.6, comment: "Heavy workload, but the placements are incredible." }
        ]
      }
    },
    {
      name: "Jadavpur University",
      location: "Kolkata",
      state: "West Bengal",
      type: "Public",
      rating: 4.6,
      totalFees: 10000,
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000",
      overview: "Jadavpur University offers exceptional ROI with negligible fees and strong academic and research output.",
      courses: {
        create: [
          { name: "B.E. Computer Science and Engineering", duration: "4 Years", fees: 10000 },
          { name: "B.E. Electronics and Telecommunication", duration: "4 Years", fees: 10000 },
          { name: "B.E. Production Engineering", duration: "4 Years", fees: 10000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 1400000, highestPackage: 22000000, placementRate: 93.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Sourav M.", rating: 4.8, comment: "Best ROI in the country, hands down." },
          { author: "Ankita D.", rating: 4.5, comment: "Highly politically active campus, but academics are great." }
        ]
      }
    },
    {
      name: "RV College of Engineering (RVCE)",
      location: "Bangalore",
      state: "Karnataka",
      type: "Private",
      rating: 4.3,
      totalFees: 250000,
      imageUrl: "https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1000",
      overview: "RVCE is a top private engineering college in Bangalore, benefiting hugely from the city's IT ecosystem.",
      courses: {
        create: [
          { name: "B.E. Computer Science and Engineering", duration: "4 Years", fees: 250000 },
          { name: "B.E. Information Science and Engineering", duration: "4 Years", fees: 250000 },
          { name: "B.E. Aerospace Engineering", duration: "4 Years", fees: 250000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 1100000, highestPackage: 18000000, placementRate: 90.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Varun K.", rating: 4.4, comment: "Location advantage is huge for internships." },
          { author: "Simran J.", rating: 4.1, comment: "Campus is a bit small and crowded." }
        ]
      }
    },
    {
      name: "College of Engineering Pune (COEP)",
      location: "Pune",
      state: "Maharashtra",
      type: "Public",
      rating: 4.5,
      totalFees: 90000,
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000",
      overview: "COEP is one of the oldest engineering colleges in Asia with a strong legacy and alumni network.",
      courses: {
        create: [
          { name: "B.Tech Computer Engineering", duration: "4 Years", fees: 90000 },
          { name: "B.Tech Mechanical Engineering", duration: "4 Years", fees: 90000 },
          { name: "B.Tech Metallurgy", duration: "4 Years", fees: 90000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 950000, highestPackage: 15000000, placementRate: 88.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Pranav D.", rating: 4.6, comment: "Heritage campus with very active technical clubs." },
          { author: "Mitali S.", rating: 4.4, comment: "Fees are affordable and placements are solid." }
        ]
      }
    },
    {
      name: "Thapar Institute of Engineering and Technology",
      location: "Patiala",
      state: "Punjab",
      type: "Private",
      rating: 4.2,
      totalFees: 480000,
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000",
      overview: "Thapar is a leading private university in North India, known for its excellent infrastructure.",
      courses: {
        create: [
          { name: "B.E. Computer Engineering", duration: "4 Years", fees: 480000 },
          { name: "B.E. Electronics and Communication", duration: "4 Years", fees: 480000 },
          { name: "B.E. Civil Engineering", duration: "4 Years", fees: 480000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 1000000, highestPackage: 16000000, placementRate: 89.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Gurpreet S.", rating: 4.3, comment: "Beautiful campus and good facilities." },
          { author: "Jasleen K.", rating: 4.1, comment: "High fees but provides good opportunities." }
        ]
      }
    },
    {
      name: "National Institute of Technology (NIT) Surathkal",
      location: "Mangalore",
      state: "Karnataka",
      type: "Public",
      rating: 4.7,
      totalFees: 180000,
      imageUrl: "https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8?auto=format&fit=crop&q=80&w=1000",
      overview: "NITK boasts a private beach and is one of the most sought-after NITs for engineering aspirants.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 180000 },
          { name: "B.Tech Information Technology", duration: "4 Years", fees: 180000 },
          { name: "B.Tech Mining Engineering", duration: "4 Years", fees: 180000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 1650000, highestPackage: 26000000, placementRate: 96.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Akash R.", rating: 4.8, comment: "Having a private beach on campus is a dream." },
          { author: "Pooja V.", rating: 4.6, comment: "Top tier faculty and amazing placements." }
        ]
      }
    },
    {
      name: "SRM Institute of Science and Technology",
      location: "Chennai",
      state: "Tamil Nadu",
      type: "Private",
      rating: 4.1,
      totalFees: 300000,
      imageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=1000",
      overview: "SRM offers a wide range of programs with a massive student population and decent placement opportunities.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 300000 },
          { name: "B.Tech Artificial Intelligence", duration: "4 Years", fees: 300000 },
          { name: "B.Tech Cloud Computing", duration: "4 Years", fees: 300000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 750000, highestPackage: 11000000, placementRate: 85.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Surya T.", rating: 4.2, comment: "Lots of events and great campus life." },
          { author: "Ananya B.", rating: 3.9, comment: "Very large batch size, so competition for placements is high." }
        ]
      }
    },
    {
      name: "Indian Institute of Technology (IIT) Madras",
      location: "Chennai",
      state: "Tamil Nadu",
      type: "Public",
      rating: 4.9,
      totalFees: 210000,
      imageUrl: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=1000",
      overview: "Consistently ranked #1 in NIRF, IIT Madras is famous for its research output and a campus situated in a national park.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 210000 },
          { name: "B.Tech Electrical Engineering", duration: "4 Years", fees: 210000 },
          { name: "B.Tech Engineering Physics", duration: "4 Years", fees: 210000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 2400000, highestPackage: 38000000, placementRate: 98.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Karthik N.", rating: 5.0, comment: "Best research facilities and amazing faculty." },
          { author: "Swati M.", rating: 4.8, comment: "Living amidst nature in a national park is wonderful." }
        ]
      }
    },
    {
      name: "Visvesvaraya National Institute of Technology (VNIT)",
      location: "Nagpur",
      state: "Maharashtra",
      type: "Public",
      rating: 4.4,
      totalFees: 160000,
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000",
      overview: "VNIT Nagpur is a premier technical institute in central India with a lush green campus.",
      courses: {
        create: [
          { name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 160000 },
          { name: "B.Tech Architecture", duration: "5 Years", fees: 160000 },
          { name: "B.Tech Mechanical Engineering", duration: "4 Years", fees: 160000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 1050000, highestPackage: 17000000, placementRate: 91.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Yash P.", rating: 4.5, comment: "Green and peaceful campus environment." },
          { author: "Mansi G.", rating: 4.3, comment: "Good academics but slightly away from major IT hubs." }
        ]
      }
    },
    {
      name: "PSG College of Technology",
      location: "Coimbatore",
      state: "Tamil Nadu",
      type: "Private",
      rating: 4.3,
      totalFees: 120000,
      imageUrl: "https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8?auto=format&fit=crop&q=80&w=1000",
      overview: "PSG Tech is known for its strong industry integration and sandwich programs.",
      courses: {
        create: [
          { name: "B.E. Computer Science and Engineering", duration: "4 Years", fees: 120000 },
          { name: "B.E. Mechanical Engineering (Sandwich)", duration: "5 Years", fees: 120000 },
          { name: "B.E. Robotics and Automation", duration: "4 Years", fees: 120000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 850000, highestPackage: 13000000, placementRate: 88.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Naveen C.", rating: 4.4, comment: "Excellent industry exposure and practical learning." },
          { author: "Kavya S.", rating: 4.2, comment: "Strict administration but good placements." }
        ]
      }
    },
    {
      name: "Nirma University",
      location: "Ahmedabad",
      state: "Gujarat",
      type: "Private",
      rating: 4.2,
      totalFees: 220000,
      imageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=1000",
      overview: "Nirma University offers quality education with a focus on holistic student development in Gujarat.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 220000 },
          { name: "B.Tech Electronics and Communication", duration: "4 Years", fees: 220000 },
          { name: "B.Tech Chemical Engineering", duration: "4 Years", fees: 220000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 700000, highestPackage: 10500000, placementRate: 85.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Jay P.", rating: 4.2, comment: "Beautiful campus and very safe environment." },
          { author: "Dhara M.", rating: 4.1, comment: "Good academics, but a bit strict." }
        ]
      }
    },
    {
      name: "Kalinga Institute of Industrial Technology (KIIT)",
      location: "Bhubaneswar",
      state: "Odisha",
      type: "Private",
      rating: 4.1,
      totalFees: 350000,
      imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1000",
      overview: "KIIT is a rapidly growing private university with excellent infrastructure and global partnerships.",
      courses: {
        create: [
          { name: "B.Tech Computer Science and Engineering", duration: "4 Years", fees: 350000 },
          { name: "B.Tech Information Technology", duration: "4 Years", fees: 350000 },
          { name: "B.Tech Civil Engineering", duration: "4 Years", fees: 350000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 800000, highestPackage: 12000000, placementRate: 87.0 }
        ]
      },
      reviews: {
        create: [
          { author: "Siddharth D.", rating: 4.1, comment: "World-class facilities and sports complexes." },
          { author: "Isha R.", rating: 4.0, comment: "Mass recruitment happens, so getting a job is relatively easier." }
        ]
      }
    }
  ];

  for (const c of colleges) {
    await prisma.college.create({ data: c });
  }
  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
