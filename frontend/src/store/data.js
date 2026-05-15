const cateringServices = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2072&auto=format&fit=crop",
      title: "Traditional Indian Cuisine",
      description: "Experience the rich flavors of authentic Indian dishes, crafted to perfection with heritage spices.",
      category: "Indian",
      rating: 4.8,
      priceRange: "$$$",
      popular: true,
      vendor: {
        id: "v1",
        name: "Royal Heritage Caterers",
        image: "https://i.pravatar.cc/150?u=v1",
        rating: 4.9,
        reviews: 128
      },
      fullMenu: {
        starters: [
          { name: "Paneer Tikka Angare", description: "Clay oven roasted cottage cheese with spicy marination" },
          { name: "Hara Bhara Kabab", description: "Vegetable patties with spinach and green peas" },
          { name: "Crispy Corn Chili", description: "Fried corn kernels tossed in spicy schezwan sauce" }
        ],
        mainCourse: [
          { name: "Dal Makhani Bukhaara", description: "Slow cooked black lentils with cream and butter" },
          { name: "Paneer Butter Masala", description: "Rich tomato based gravy with soft cottage cheese" },
          { name: "Jeera Saffron Rice", description: "Aromatic basmati rice with cumin and saffron" },
          { name: "Assorted Indian Breads", description: "Butter Naan, Garlic Naan, and Tandoori Roti" }
        ],
        desserts: [
          { name: "Gulab Jamun with Rabri", description: "Hot milk dumplings served with thick condensed milk" },
          { name: "Kesar Pista Kulfi", description: "Traditional Indian ice cream with saffron and pistachios" }
        ],
        beverages: [
          { name: "Masala Chaas", description: "Spiced buttermilk with fresh coriander" },
          { name: "Fresh Lime Soda", description: "Refreshing sweet and salty lemon drink" }
        ]
      },
      includedServices: [
        { title: "Buffet Setup", description: "Full premium buffet setup with warmers and decor" },
        { title: "Uniformed Servers", description: "Professional waitstaff in formal catering attire" },
        { title: "Premium Cutlery", description: "Bone china plates and stainless steel cutlery" },
        { title: "Live Counter", description: "Live pasta or chaat counter included in the package" },
        { title: "Waste Management", description: "Complete cleanup and eco-friendly waste disposal" }
      ]
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1974&auto=format&fit=crop",
      title: "North Indian Delights",
      description: "Indulge in exotic gravies, tandoori specialties, and the finest basmati rice dishes.",
      category: "North Indian",
      rating: 4.9,
      priceRange: "$$",
      popular: true,
      vendor: {
        id: "v2",
        name: "Spice Symphony",
        image: "https://i.pravatar.cc/150?u=v2",
        rating: 4.7,
        reviews: 85
      },
      fullMenu: {
        starters: [
          { name: "Chicken 65", description: "Spicy deep-fried chicken tempered with curry leaves" },
          { name: "Seekh Kabab", description: "Minced meat skewers with aromatic spices" }
        ],
        mainCourse: [
          { name: "Butter Chicken", description: "Classic creamy tomato gravy with grilled chicken" },
          { name: "Mutton Rogan Josh", description: "Traditional Kashmiri lamb curry" }
        ],
        desserts: [{ name: "Phirni", description: "Rice pudding with cardamom and nuts" }],
        beverages: [{ name: "Sweet Lassi", description: "Thick yogurt drink with saffron" }]
      },
      includedServices: [
        { title: "Plated Service", description: "Formal seated service for all guests" },
        { title: "Bar Setup", description: "Professional bar counter with mixologist" }
      ]
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop",
      title: "Authentic Kerala Sadhya",
      description: "A traditional Kerala feast served on a banana leaf with over 20 variety of vegetarian dishes.",
      category: "South Indian",
      rating: 5.0,
      priceRange: "$$$",
      popular: false,
      vendor: {
        id: "v3",
        name: "Malabar Flavors",
        image: "https://i.pravatar.cc/150?u=v3",
        rating: 4.8,
        reviews: 210
      },
      fullMenu: {
        starters: [{ name: "Banana Chips & Sharkara Varatti", description: "Traditional sweet and salty snacks" }],
        mainCourse: [
          { name: "Kerala Sadhya", description: "Grand feast with 24 items on a banana leaf" },
          { name: "Avial & Olan", description: "Coconut and vegetable based traditional stews" }
        ],
        desserts: [{ name: "Palada Pradhaman", description: "Rich rice flake payasam" }],
        beverages: [{ name: "Sambharam", description: "Spiced buttermilk with ginger" }]
      },
      includedServices: [
        { title: "Banana Leaf Service", description: "Authentic traditional serving style" },
        { title: "Ethnic Decor", description: "Traditional flower and lamp decorations" }
      ]
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
      title: "Mediterranean Feast",
      description: "Fresh, healthy, and vibrant dishes from the heart of the Mediterranean coast.",
      category: "Continental",
      rating: 4.7,
      priceRange: "$$",
      popular: false,
      vendor: {
        id: "v4",
        name: "Oceanic Bites",
        image: "https://i.pravatar.cc/150?u=v4",
        rating: 4.5,
        reviews: 42
      }
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=2064&auto=format&fit=crop",
      title: "Pan-Asian Fusion",
      description: "A perfect blend of Thai, Chinese, and Japanese flavors that will excite your palate.",
      category: "Asian",
      rating: 4.6,
      priceRange: "$$$",
      popular: true,
      vendor: {
        id: "v5",
        name: "Zen Kitchen",
        image: "https://i.pravatar.cc/150?u=v5",
        rating: 4.6,
        reviews: 156
      }
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
      title: "Gourmet Continental",
      description: "Fine dining catering featuring artisanal ingredients and sophisticated presentations.",
      category: "Continental",
      rating: 4.9,
      priceRange: "$$$$",
      popular: false,
      vendor: {
        id: "v6",
        name: "Elite Banquet Services",
        image: "https://i.pravatar.cc/150?u=v6",
        rating: 5.0,
        reviews: 302
      }
    }
  ];
  
  export default cateringServices;