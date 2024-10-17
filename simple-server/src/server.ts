import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import playerRoutes from './routes/index'; 

const app: Application = express();
const port: number = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/players', playerRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
