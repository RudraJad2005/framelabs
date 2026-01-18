// Supabase PostgreSQL Database Configuration
const { Sequelize } = require('sequelize');

let sequelize = null;

const connectDB = async () => {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
        console.log('⚠️  DATABASE_URL not set. Running without database.');
        return null;
    }

    try {
        sequelize = new Sequelize(databaseUrl, {
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });

        await sequelize.authenticate();
        console.log('✅ Supabase PostgreSQL connected successfully');
        
        return sequelize;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        return null;
    }
};

const getSequelize = () => sequelize;

module.exports = { connectDB, getSequelize };
