
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import 'dotenv/config';
import fs from 'fs/promises';
import express from 'express';

const app = express();

// db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error: ", err));

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());



const routesDir = './routes';

async function registerRoutes() {
  try {
    const files = await fs.readdir(routesDir);
    await Promise.all(files.map(async (file) => {
      if (file.endsWith('.js')) {
        const routePath = `./routes/${file}`;
        const { default: route } = await import(routePath);
        app.use('/api', route);
      }
    }));
  }
  catch (err) {
    console.error('Error reading or registering routes:', err);
  }
}

// Call the function to register routes
registerRoutes().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
