import Product1 from './Images/Product1.jpeg';
import Product2 from './Images/Product2.jpeg';
import Product3 from './Images/Product3.jpeg';
import Product4 from './Images/Product4.jpeg';
import Product5 from './Images/Product5.jpeg';
import Product6 from './Images/Product6.jpeg';
import Product7 from './Images/Product7.jpeg';
import Product8 from './Images/Product8.jpeg';
import Product9 from './Images/Product9.jpeg';
import Product10 from './Images/Product10.jpeg';
import Product11 from './Images/Product11.jpeg';
import Product12 from './Images/Product12.jpeg';
import Product13 from './Images/Product13.jpeg';
import Product14 from './Images/Product14.jpeg';
import Product15 from './Images/Product15.jpeg';
import Product16 from './Images/Product16.jpeg';
import Product17 from './Images/Product17.jpeg';
import Product18 from './Images/Product18.jpeg';
import Product19 from './Images/Product19.jpeg';
import Product20 from './Images/Product20.jpeg';
import Product21 from './Images/Product21.jpeg';
import Product22 from './Images/Product22.png'; // Fixed extension
import Product23 from './Images/Product23.png'; // Fixed extension
import Product24 from './Images/Product24.jpeg';
import Product25 from './Images/Product25.png'; // Fixed extension
import Product26 from './Images/Product26.jpeg';
import Product27 from './Images/Product27.jpeg';
import Product28 from './Images/Product28.jpeg';
import Product29 from './Images/Product29.jpeg';
import Product30 from './Images/Product30.jpeg';
import Product31 from './Images/Product31.jpeg';
import Product32 from './Images/Product32.jpeg';
import Product33 from './Images/Product33.jpeg';
import Product34 from './Images/Product34.jpeg';
import Product35 from './Images/Product35.jpeg';

import WebsiteLogo from './Images/WebsiteLogo.jpeg'

export const STORE_INFO = {
    name: "Kisan & Parivaar SuperMall",
    tagline: "Farm Fertilizers · Daily Kirana · Luxury Beauty",
    contact: "+91 98765 43210",
    address: "Shop No. 12-16, Main Market Road, Punjab",
    gstNumber: "03AAAAA0000A1Z5",
    deliveryPincodes: ["147001", "147002", "140406", "140407"]
};

export const SECTIONS_DATA = [
    {
        id: "fertilizer",
        title: "Agri-Care & Fertilizers",
        subtitle: "Certified Seeds, Organic Pesticides & Crop Nutrition",
        badge: "100% Govt. Authorized",
        colors: {
            primary: "#0D4C3C",     
            secondary: "#7AA05A",   
            accent: "#2D5A4A",      
            background: "#F4F1EB",  
            text: "#083328"
        }
    },
    {
        id: "kirana",
        title: "Kirana & General Store",
        subtitle: "Pantry Staples, Atta, Pulses, Dairy & Daily Home Needs",
        badge: "Fresh & Wholesale Rates",
        colors: {
            primary: "#092634",     
            secondary: "#004E72",   
            accent: "#FF6E42",      
            background: "#F9F9F9",  
            text: "#092634"
        }
    },
    {
        id: "beauty",
        title: "Beauty & Personal Care",
        subtitle: "Skin Nutrition, Hair Care, Organic Grooming & Perfumery",
        badge: "Dermatologically Tested",
        colors: {
            primary: "#710014",     
            secondary: "#B38F6F",   
            accent: "#161616",      
            background: "#F2F1ED",  
            text: "#161616"
        }
    }
];

export const PRODUCTS_CATALOG = {
    fertilizer: [
        {
            id: "agri-1",
            name: "IFFCO Urea Bio-Enriched",
            category: "Macro Nutrients",
            price: 266,
            mrp: 290,
            stock: 140,
            soldCount: 420, 
            unit: "45 kg Bag",
            rating: 4.9,
            image: Product1, // Using imported variable
            description: "Slow release nitrogen fertilizer for high vegetative growth."
        },
        {
            id: "agri-2",
            name: "DAP (Diammonium Phosphate) 18:46:0",
            category: "Phosphatic",
            price: 1350,
            mrp: 1400,
            stock: 85,
            soldCount: 310, 
            unit: "50 kg Bag",
            rating: 4.8,
            image: Product2,
            description: "Essential root development compound for wheat and paddy crops."
        },
        {
            id: "agri-3",
            name: "Organic Neem Cake Natural Fertilizer",
            category: "Organic Bio-Fertilizer",
            price: 680,
            mrp: 750,
            stock: 45,
            soldCount: 140, 
            unit: "25 kg Bag",
            rating: 4.7,
            image: Product3,
            description: "Shields root zone from termites and soil nematodes."
        },
        {
            id: "agri-4",
            name: "Bayer Confidor Insecticide",
            category: "Crop Protection",
            price: 340,
            mrp: 380,
            stock: 60,
            soldCount: 205, 
            unit: "100 ml Bottle",
            rating: 4.9,
            image: Product4,
            description: "High efficacy systemic pest control for aphids, jassids, and thrips."
        },
        {
            id: "agri-5",
            name: "Organic Dug Manure",
            category: "Organic Bio-Fertilizer",
            price: 350,
            mrp: 400,
            stock: 85,
            soldCount: 110,
            unit: "5 kg Bag",
            rating: 4.9,
            image: Product5,
            description: "Primary composed of digested green grain and bedding."
        },
        {
            id: "agri-6",
            name: "Ugao Dhara Best Quality Vermicompost",
            category: "Organic Bio-Fertilizer",
            price: 250,
            mrp: 300,
            stock: 100,
            soldCount: 450, 
            unit: "10 KG",
            rating: 4.8,
            image: Product6,
            description: "100% natural, chemical free, soil enricher, eco friendly."
        },
        {
            id: "agri-7",
            name: "Organic Plant Vermicompost",
            category: "Organic Bio-Fertilizer",
            price: 220,
            mrp: 280,
            stock: 120,
            soldCount: 85,
            unit: "10 KG",
            rating: 4.7,
            image: Product7,
            description: "Premium quality vermicompost for all plant types."
        },
        {
            id: "agri-8",
            name: "Agronix Plant Food Liquid Biofertilizer",
            category: "Plant Food",
            price: 299,
            mrp: 350,
            stock: 60,
            soldCount: 95,
            unit: "3x 50 ml",
            rating: 4.9,
            image: Product8,
            description: "Supports healthy plant growth, root development, nutrient uptake, and plant vitality."
        },
        {
            id: "agri-9",
            name: "Bloom Buddy Organic Growth Booster",
            category: "Growth Booster",
            price: 180,
            mrp: 220,
            stock: 90,
            soldCount: 260, 
            unit: "500g",
            rating: 4.8,
            image: Product9,
            description: "Rich in plant nutrition: Enhances growth."
        },
        {
            id: "agri-10",
            name: "Waste Decomposer (For Farmers use only)",
            category: "Waste Decomposer",
            price: 120,
            mrp: 150,
            stock: 200,
            soldCount: 145,
            unit: "1 Bottle",
            rating: 4.9,
            image: Product10,
            description: "Recommended for all crops."
        },
        {
            id: "agri-11",
            name: "Casa De Amor Bloom Care Granules",
            category: "Plant Food",
            price: 249,
            mrp: 300,
            stock: 110,
            soldCount: 290, 
            unit: "500g",
            rating: 4.8,
            image: Product11,
            description: "All purpose plant food granules for healthy plants, more blooms, and flowering size increase."
        }
    ],

    kirana: [
        {
            id: "kir-1",
            name: "Aashirvaad Shudh Chakki Atta",
            category: "Flours & Grains",
            price: 440,
            mrp: 480,
            stock: 120,
            soldCount: 560, 
            unit: "10 kg Pack",
            rating: 4.8,
            image: Product12,
            description: "100% whole wheat flour ground from heavy grains."
        },
        {
            id: "kir-2",
            name: "Fortune Kachi Ghani Mustard Oil",
            category: "Edible Oils & Ghee",
            price: 155,
            mrp: 175,
            stock: 90,
            soldCount: 490, 
            unit: "1 Litre Pouch",
            rating: 4.9,
            image: Product13,
            description: "Cold-pressed pure mustard oil with authentic aroma."
        },
        {
            id: "kir-3",
            name: "Tata Salt Vacuum Evaporated",
            category: "Pantry Staples",
            price: 28,
            mrp: 30,
            stock: 300,
            soldCount: 800, 
            unit: "1 kg Pack",
            rating: 5.0,
            image: Product14,
            description: "Desh ka namak with iodized micro-minerals."
        },
        {
            id: "kir-4",
            name: "India Gate Basmati Rice Classic",
            category: "Rice & Pulses",
            price: 520,
            mrp: 610,
            stock: 40,
            soldCount: 220, 
            unit: "5 kg Bag",
            rating: 4.9,
            image: Product15,
            description: "Aged long grain aromatic rice for biryanis and daily dining."
        },
        {
            id: "kir-5",
            name: "Grainva Diabetic Care Flour",
            category: "Flours & Grains",
            price: 350,
            mrp: 400,
            stock: 65,
            soldCount: 140,
            unit: "3 Kg",
            rating: 4.7,
            image: Product16,
            description: "Helps to control sugar level. 100% Natural."
        },
        {
            id: "kir-6",
            name: "Cadbury Dairy Milk Silk Hazelnut",
            category: "Chocolates & Sweets",
            price: 160,
            mrp: 180,
            stock: 140,
            soldCount: 410, 
            unit: "143g",
            rating: 4.8,
            image: Product17,
            description: "100% sustainably sourced cocoa with roasted hazelnuts."
        },
        {
            id: "kir-7",
            name: "Cadbury Dairy Milk Silk",
            category: "Chocolates & Sweets",
            price: 150,
            mrp: 170,
            stock: 200,
            soldCount: 550, 
            unit: "150g",
            rating: 4.9,
            image: Product18,
            description: "Classic creamy milk chocolate, 100% sustainably sourced cocoa."
        },
        {
            id: "kir-8",
            name: "Nature Fam Almonds",
            category: "Dry Fruits & Nuts",
            price: 650,
            mrp: 800,
            stock: 80,
            soldCount: 120,
            unit: "3 x 250g",
            rating: 4.9,
            image: Product19,
            description: "Premium quality almonds for a healthy lifestyle."
        }
    ],

    beauty: [
        {
            id: "bt-1",
            name: "Santoor Skin Softening Sandal & Almond Milk",
            category: "Bath & Body",
            price: 195,
            mrp: 220,
            stock: 120,
            soldCount: 650, 
            unit: "150g x 6 Soaps",
            rating: 4.8,
            image: Product20,
            description: "Deep acting ingredients of Sandal and Almond Milk for soft, younger-looking skin."
        },
        {
            id: "bt-2",
            name: "Pantene Hairfall Control Shampoo",
            category: "Hair Care",
            price: 499,
            mrp: 650,
            stock: 85,
            soldCount: 320, 
            unit: "1 Litre Dispenser",
            rating: 4.7,
            image: Product21,
            description: "Pro-V formula to strengthen hair from root to tip and reduce hairfall."
        },
        {
            id: "bt-3",
            name: "L'Oréal Paris Total Repair 5 Shampoo",
            category: "Hair Care",
            price: 520,
            mrp: 750,
            stock: 60,
            soldCount: 410, 
            unit: "1 Litre Dispenser",
            rating: 4.9,
            image: Product22,
            description: "Repairs 5 signs of hair damage with Ceramide-Cement technology."
        },
        {
            id: "bt-4",
            name: "UrbanGabru Hair Removal Cream Spray",
            category: "Men's Grooming",
            price: 299,
            mrp: 350,
            stock: 45,
            soldCount: 190, 
            unit: "200 ml Spray",
            rating: 4.5,
            image: Product23,
            description: "Painless body hair removal spray for men, infused with Aloe Vera."
        },
        {
            id: "bt-5",
            name: "NIVEA Men Dark Spot Reduction Face Wash",
            category: "Face Care",
            price: 440,
            mrp: 510,
            stock: 90,
            soldCount: 140,
            unit: "Pack of 3",
            rating: 4.7,
            image: Product24,
            description: "Reduces dark spots and effectively cleanses skin with Vitamin C."
        },
        {
            id: "bt-6",
            name: "Listerine Cool Mint Mouthwash",
            category: "Oral Care",
            price: 250,
            mrp: 280,
            stock: 150,
            soldCount: 520, 
            unit: "500 ml + 250 ml",
            rating: 4.8,
            image: Product25,
            description: "24-hour protection against plaque and bad breath germs."
        },
        {
            id: "bt-7",
            name: "Premium Pink Makeup Brushes Set",
            category: "Cosmetics Tools",
            price: 899,
            mrp: 1499,
            stock: 30,
            soldCount: 110,
            unit: "12 Brushes + Pouch",
            rating: 4.6,
            image: Product26,
            description: "Complete synthetic makeup brush kit for flawless application."
        },
        {
            id: "bt-8",
            name: "Santoor Pureglo Glycerine Soap",
            category: "Bath & Body",
            price: 240,
            mrp: 275,
            stock: 110,
            soldCount: 390, 
            unit: "Pack of 6",
            rating: 4.8,
            image: Product27,
            description: "Enriched with pure glycerine and almond oil for deep moisturization."
        },
        {
            id: "bt-9",
            name: "Mila Beaute Perfecting Compact Powder",
            category: "Face Makeup",
            price: 299,
            mrp: 399,
            stock: 150,
            soldCount: 95,
            unit: "16 Gm",
            rating: 4.7,
            image: Product28,
            description: "Weightless & superstay SPF 15 compact powder."
        },
        {
            id: "bt-10",
            name: "Willory 20% Urea Foot Roll-On",
            category: "Foot Care",
            price: 199,
            mrp: 299,
            stock: 80,
            soldCount: 120,
            unit: "50 ml",
            rating: 4.6,
            image: Product29,
            description: "With Lactic Acid & Vitamin E. Exfoliate & Hydrate."
        },
        {
            id: "bt-11",
            name: "Cocowalk Diamond Facial Kit",
            category: "Skin Care",
            price: 650,
            mrp: 850,
            stock: 60,
            soldCount: 140,
            unit: "Kit",
            rating: 4.8,
            image: Product30,
            description: "Rejuvenate skin, active multi layer impact. For all skin types."
        },
        {
            id: "bt-12",
            name: "Huda Girl Rose Gold Palette",
            category: "Eye Makeup",
            price: 850,
            mrp: 1200,
            stock: 45,
            soldCount: 310, 
            unit: "Palette",
            rating: 4.9,
            image: Product31,
            description: "Set of 2 eyeshadow palette nude edition and rose gold."
        },
        {
            id: "bt-13",
            name: "Proskire Skin Perfecting Facewash",
            category: "Face Care",
            price: 350,
            mrp: 450,
            stock: 90,
            soldCount: 130,
            unit: "100 ml",
            rating: 4.7,
            image: Product32,
            description: "Hydration & barrier support. Brightening, hydrating, smoothening with Niacinamide & Ceramides."
        },
        {
            id: "bt-14",
            name: "Ghar Soaps Headmaster Anti Dandruff Shampoo",
            category: "Hair Care",
            price: 399,
            mrp: 599,
            stock: 120,
            soldCount: 420, 
            unit: "200 ml",
            rating: 4.8,
            image: Product33,
            description: "Salicylic Acid + Reetha + Shikakai. Healthy flake-free scalp."
        },
        {
            id: "bt-15",
            name: "Dr. Rashel De-Tan Scrub",
            category: "Skin Care",
            price: 299,
            mrp: 350,
            stock: 75,
            soldCount: 220, 
            unit: "380 ml",
            rating: 4.6,
            image: Product34,
            description: "De-tan scrub for face & body with walnut & clove extract."
        },
        {
            id: "bt-16",
            name: "Oneway Handwash Combo",
            category: "Bath & Body",
            price: 399,
            mrp: 599,
            stock: 100,
            soldCount: 145,
            unit: "3 x 500 ml",
            rating: 4.7,
            image: Product35,
            description: "Liquid hand wash combo pack of 3. Neem Aloe Vera & French Rose."
        }
    ]
};

export const WebImage = {
    WebsiteLogo,
    
}