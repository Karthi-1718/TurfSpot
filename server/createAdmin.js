import mongoose from "mongoose";
import * as argon2 from "argon2";
import Owner from "./models/owner.model.js"; // adjust path if needed

mongoose.connect("mongodb+srv://tamil:karthi24@cluster0.xtqwkiy.mongodb.net/?appName=Cluster0") // change DB name
  .then(async () => {
    console.log("DB connected");

    const hashedPassword = await argon2.hash("Admin@123"); // choose your password

    const admin = new Owner({
      name: "Admin",
      email: "admin@gmail.com",
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin created successfully!");
    process.exit();
  })
  .catch(err => console.log(err));
