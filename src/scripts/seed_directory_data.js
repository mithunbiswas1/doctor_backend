// ael_backend/src/scripts/seed_directory_data.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Directory } from "../models/directory.model.js";

dotenv.config({ path: "./.env" });

const sampleDirectory = [
  {
    registrationId: "DLR-DHK-00101",
    name: "Al-Haj Mohammad Hossain",
    phone: "01711998877",
    type: "dealer",
    businessName: "Hossain Gas & Cylinder Agency",
    district: "Dhaka",
    upazila: "Mirpur",
    address: "Plot 12, Section 10, Mirpur, Dhaka-1216",
    status: "verified",
    cylinderBrand: "Bashundhara & Omera",
    monthlyVolume: 450,
    licenseNumber: "DOE-LPG-DHK-2018-882",
  },
  {
    registrationId: "DLR-CTG-00204",
    name: "Abdul Karim Chowdhury",
    phone: "01819334455",
    type: "dealer",
    businessName: "Karnaphuli LPG Distributors",
    district: "Chittagong",
    upazila: "Agrabad",
    address: "44 Commercial Area, Agrabad, Chattogram",
    status: "verified",
    cylinderBrand: "Total & BM Energy",
    monthlyVolume: 720,
    licenseNumber: "DOE-LPG-CTG-2019-441",
  },
  {
    registrationId: "DLR-SYL-00309",
    name: "Syed Mufazzal Ali",
    phone: "01712556677",
    type: "dealer",
    businessName: "Surma Energy & LPG Trading",
    district: "Sylhet",
    upazila: "Zindabazar",
    address: "Amberkhana Road, Sylhet",
    status: "verified",
    cylinderBrand: "Beximco & Jamuna",
    monthlyVolume: 380,
    licenseNumber: "DOE-LPG-SYL-2020-192",
  },
  {
    registrationId: "CNS-DHK-99412",
    name: "Begum Rokeya Sultana",
    phone: "01911443322",
    type: "consumer",
    businessName: "Residential Household",
    district: "Dhaka",
    upazila: "Uttara",
    address: "House 24, Road 11, Sector 4, Uttara, Dhaka",
    status: "verified",
    cylinderBrand: "Omera LPG (12kg)",
    monthlyVolume: 2,
  },
  {
    registrationId: "IND-KHL-55201",
    name: "Engr. Monirul Islam",
    phone: "01611778899",
    type: "industrial_client",
    businessName: "Rupsha Seafood & Cold Storage Ltd.",
    district: "Khulna",
    upazila: "Rupsha",
    address: "Rupsha Industrial Zone, Khulna",
    status: "verified",
    cylinderBrand: "Bashundhara 45kg Manifold",
    monthlyVolume: 180,
    licenseNumber: "DOE-IND-KHL-2021-098",
  },
  {
    registrationId: "DLR-RAJ-00412",
    name: "Tariqul Islam Mondol",
    phone: "01718889900",
    type: "dealer",
    businessName: "Padma LPG Corner",
    district: "Rajshahi",
    upazila: "Boalia",
    address: "Station Road, Boalia, Rajshahi",
    status: "verified",
    cylinderBrand: "Jamuna & Omera",
    monthlyVolume: 290,
    licenseNumber: "DOE-LPG-RAJ-2020-554",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ael");
    console.log("Connected to MongoDB for Directory Seeding...");

    for (const item of sampleDirectory) {
      await Directory.findOneAndUpdate(
        { registrationId: item.registrationId },
        item,
        { upsert: true, new: true }
      );
    }

    console.log("Directory data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

seed();
