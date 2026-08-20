import mongoose from "mongoose";
import dns from "dns";

// Force Node's internal DNS resolver to use Google's public DNS.
// Fixes "querySrv ECONNREFUSED" errors some Windows/network setups hit
// when resolving MongoDB Atlas's SRV record, even though system-level
// DNS lookups (e.g. nslookup) succeed fine.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;