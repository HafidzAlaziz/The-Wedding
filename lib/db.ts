import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === 'production') {
    console.warn('Warning: DATABASE_URL is not defined in production environment.');
}

const sql = neon(databaseUrl || '');

export default sql;
