import dotenv from "dotenv";
import connectdb from "./db/index.js";
import { app, server } from "./app.js";
import { initializeSocket } from "./utils/socket.js";

dotenv.config({ path: "./.env" });

connectdb()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    
    // Initialize socket
    const io = initializeSocket(server);
    
    server.listen(PORT, () => {
      console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  });

