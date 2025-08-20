import "dotenv/config";
import service from '../service/bootstrap.ts';
import app from './routes/mainRoutes.ts';

const PORT = process.env.PORT || 3500;

const server = app.listen(PORT, () => console.log('Server started on port ', PORT));

function shutdown() {
    service.save();
    server.close(() => console.log('Server stopped'));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;