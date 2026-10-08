import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { Admin } from "./models/Admin.js";
import { ShowroomProfile } from "./models/ShowroomProfile.js";
import { Vehicle } from "./models/Vehicle.js";
import { app } from "./app.js";

const additionalVehicles = [
  {
    make: "Porsche", model: "Taycan 4S", year: 2022, price: 438000, mileage: 14200,
    transmission: "2-speed automatic", fuel: "Electric", bodyStyle: "Sedan", exterior: "Frozen blue",
    description: "A fully electric performance saloon combining instant acceleration with a quiet, beautifully finished cabin.",
    image: "/cars/porsche-taycan.jpg"
  },
  {
    make: "Mercedes-Benz", model: "G 350 BlueTEC", year: 2021, price: 988000, mileage: 21800,
    transmission: "7-speed automatic", fuel: "Diesel", bodyStyle: "SUV", exterior: "Obsidian black",
    description: "A distinctive, hand-finished off-roader with commanding road presence and considered everyday comfort.",
    image: "/cars/mercedes-g-class.jpg"
  },
  {
    make: "BMW", model: "M4 Competition", year: 2021, price: 638000, mileage: 12600,
    transmission: "8-speed automatic", fuel: "Petrol", bodyStyle: "Coupe", exterior: "Toronto red",
    description: "A focused M car with precise handling, muscular turbocharged power and a driver-first cockpit.",
    image: "/cars/bmw-m4.jpg"
  },
  {
    make: "Audi", model: "R8 V10 Plus", year: 2018, price: 1280000, mileage: 19300,
    transmission: "7-speed S tronic", fuel: "Petrol", bodyStyle: "Coupe", exterior: "Suzuka grey",
    description: "A naturally aspirated V10 supercar with unmistakable proportions and finely balanced everyday usability.",
    image: "/cars/audi-r8.jpg"
  },
  {
    make: "Lamborghini", model: "Huracán LP 610-4", year: 2017, price: 1680000, mileage: 16800,
    transmission: "7-speed dual-clutch", fuel: "Petrol", bodyStyle: "Coupe", exterior: "Arancio borealis",
    description: "A dramatic all-wheel-drive supercar pairing a high-revving V10 with sharp, confidence-inspiring control.",
    image: "/cars/lamborghini-huracan.jpg"
  },
  {
    make: "Ferrari", model: "F8 Tributo", year: 2020, price: 1750000, mileage: 8900,
    transmission: "7-speed dual-clutch", fuel: "Petrol", bodyStyle: "Coupe", exterior: "Rosso corsa",
    description: "A mid-engined Ferrari with responsive turbocharged power, sculpted aerodynamics and a meticulous cockpit.",
    image: "/cars/ferrari-f8-tributo.jpg"
  },
  {
    make: "Bentley", model: "Continental GT First Edition", year: 2021, price: 1280000, mileage: 13700,
    transmission: "8-speed dual-clutch", fuel: "Petrol", bodyStyle: "Grand Tourer", exterior: "Beluga",
    description: "A handcrafted grand tourer with supple ride quality, rich cabin materials and effortless long-distance pace.",
    image: "/cars/bentley-continental-gt.jpg"
  },
  {
    make: "Rolls-Royce", model: "Cullinan", year: 2021, price: 2280000, mileage: 11200,
    transmission: "8-speed automatic", fuel: "Petrol", bodyStyle: "SUV", exterior: "Anthracite",
    description: "A serene, spacious luxury SUV finished for exceptional comfort on every kind of journey.",
    image: "/cars/rolls-royce-cullinan.jpg"
  },
  {
    make: "Toyota", model: "GR Supra 3.0", year: 2021, price: 268000, mileage: 18400,
    transmission: "8-speed automatic", fuel: "Petrol", bodyStyle: "Coupe", exterior: "Renaissance red",
    description: "A compact rear-wheel-drive sports coupe with eager turbocharged response and balanced handling.",
    image: "/cars/toyota-gr-supra.png"
  },
  {
    make: "Honda", model: "Civic Type R", year: 2023, price: 285000, mileage: 6200,
    transmission: "6-speed manual", fuel: "Petrol", bodyStyle: "Hatchback", exterior: "Championship white",
    description: "A precise, practical performance hatch with a rewarding manual gearbox and track-developed chassis tuning.",
    image: "/cars/honda-civic-type-r.jpg"
  },
  {
    make: "Porsche", model: "Cayenne", year: 2022, price: 688000, mileage: 17600,
    transmission: "8-speed Tiptronic S", fuel: "Petrol", bodyStyle: "SUV", exterior: "Carrara white",
    description: "A versatile luxury SUV that brings composed touring comfort together with unmistakable Porsche handling.",
    image: "/cars/porsche-cayenne.jpg"
  },
  {
    make: "Mercedes-Benz", model: "S 500 4MATIC", year: 2022, price: 728000, mileage: 14900,
    transmission: "9-speed automatic", fuel: "Petrol mild hybrid", bodyStyle: "Sedan", exterior: "Selenite grey",
    description: "A flagship saloon with a quiet, technology-rich cabin and relaxed four-wheel-drive performance.",
    image: "/cars/mercedes-s-class.jpg"
  },
  {
    make: "BMW", model: "X7 xDrive40i", year: 2023, price: 868000, mileage: 9800,
    transmission: "8-speed automatic", fuel: "Petrol mild hybrid", bodyStyle: "SUV", exterior: "Mineral white",
    description: "A spacious three-row luxury SUV with confident all-wheel drive and a polished, comfortable ride.",
    image: "/cars/bmw-x7.jpg"
  },
  {
    make: "Lamborghini", model: "Urus SE", year: 2024, price: 1580000, mileage: 2100,
    transmission: "8-speed automatic", fuel: "Plug-in hybrid", bodyStyle: "SUV", exterior: "Verde mercurius",
    description: "A bold performance SUV with electrified response, generous versatility and unmistakable Lamborghini design.",
    image: "/cars/lamborghini-urus.jpg"
  },
  {
    make: "Ferrari", model: "Roma", year: 2022, price: 1180000, mileage: 7400,
    transmission: "8-speed dual-clutch", fuel: "Petrol", bodyStyle: "Coupe", exterior: "Rosso Fiorano",
    description: "An elegant front-engined grand tourer balancing refined comfort with lively Ferrari performance.",
    image: "/cars/ferrari-roma.jpg"
  }
];

async function seedInitialData() {
  const admin = await Admin.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
  if (!admin) {
    await Admin.create({
      email: env.ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(env.ADMIN_PASSWORD, 12)
    });
    console.info(`Created showroom administrator: ${env.ADMIN_EMAIL}`);
  }

  const profile = await ShowroomProfile.findOne({ key: "main" });
  if (!profile) {
    await ShowroomProfile.create({
      key: "main",
      brand: "AURALUXE MOTORS",
      tagline: "A finer way to find your next drive.",
      description: "A considered collection of exceptional automobiles, selected for the way they make every journey feel.",
      location: "Kuala Lumpur, Malaysia",
      phone: "+60 12 345 6789",
      email: env.ADMIN_EMAIL,
      heroImage: "/cars/merceds.jpeg",
      services: ["Curated vehicle sourcing", "Flexible financing", "Nationwide delivery", "Aftercare & trade-ins"]
    });
  }

  if (await Vehicle.countDocuments() === 0) {
    await Vehicle.insertMany([
      {
        make: "Audi", model: "A6 Premium", year: 2024, price: 258000, mileage: 1200,
        transmission: "Automatic", fuel: "Petrol", bodyStyle: "Sedan", exterior: "Glacier white",
        description: "Elegant executive comfort, intuitive technology and effortless performance in one beautifully composed saloon.",
        image: "/cars/audi.jpeg", featured: true
      },
      {
        make: "Mercedes-Benz", model: "AMG Coupé", year: 2024, price: 428000, mileage: 850,
        transmission: "Automatic", fuel: "Petrol", bodyStyle: "Coupe", exterior: "Obsidian black",
        description: "A sculpted grand tourer with unmistakable presence, a refined cabin and a thrillingly responsive drive.",
        image: "/cars/merceds.jpeg", featured: true
      },
      {
        make: "Porsche", model: "911 Carrera", year: 2023, price: 598000, mileage: 4300,
        transmission: "PDK Automatic", fuel: "Petrol", bodyStyle: "Sports", exterior: "Racing blue",
        description: "An iconic driver-focused sports car with timeless lines, precise engineering and everyday usability.",
        image: "/cars/sport.jpeg", featured: true
      },
      {
        make: "BMW", model: "5 Series", year: 2023, price: 318000, mileage: 6100,
        transmission: "Automatic", fuel: "Hybrid", bodyStyle: "Sedan", exterior: "Sapphire black",
        description: "Modern luxury and confident road manners meet in this impeccably finished executive favourite.",
        image: "/cars/1.jpeg"
      },
      {
        make: "Lexus", model: "Luxury SUV", year: 2022, price: 368000, mileage: 9800,
        transmission: "Automatic", fuel: "Petrol", bodyStyle: "SUV", exterior: "Pearl white",
        description: "Quiet craftsmanship, generous space and enduring comfort for the journeys worth taking.",
        image: "/cars/2.jpeg"
      },
      {
        make: "Mercedes-Benz", model: "eSprinter", year: 2024, price: 238000, mileage: 700,
        transmission: "Automatic", fuel: "Electric", bodyStyle: "Van", exterior: "Silver",
        description: "An all-electric delivery vehicle that pairs practical range with a thoughtfully finished cabin.",
        image: "/cars/m.jpg"
      }
    ]);
  }

  await Vehicle.bulkWrite([
    ...additionalVehicles.map((vehicle) => ({
      updateOne: {
        filter: { make: vehicle.make, model: vehicle.model },
        update: { $setOnInsert: vehicle },
        upsert: true
      }
    })),
    {
      updateOne: {
        filter: { make: "BMW", model: "5 Series" },
        update: { $set: { image: "/cars/bmw-5-series.jpg" } }
      }
    },
    {
      updateOne: {
        filter: { make: "Lexus", model: "Luxury SUV" },
        update: { $set: { image: "/cars/lexus-rx.jpg" } }
      }
    },
    {
      updateOne: {
        filter: { make: "Mercedes-Benz", model: "eSprinter" },
        update: { $set: { image: "/cars/mercedes-sprinter.jpg" } }
      }
    }
  ]);
}

try {
  await connectDatabase(env.MONGODB_URI);
  await seedInitialData();
  app.listen(env.PORT, () => console.info(`Luxe Motors API listening on port ${env.PORT}`));
} catch (error) {
  console.error("Unable to start the API:", error);
  process.exit(1);
}
