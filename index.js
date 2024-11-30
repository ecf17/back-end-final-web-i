import { app } from './server.js';
import { end } from './src/core/config/dbConfig.js';

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});

// Close database connection on exit
process.on('SIGINT', () => {
    console.log('Closing application...');
    end().then(() => {
        console.log('Database connection closed.');
        process.exit(0);
    });
})

// logear