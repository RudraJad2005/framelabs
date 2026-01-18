// User Model for PostgreSQL/Supabase
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

let User = null;

const initUserModel = (sequelize) => {
    User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true // Null for OAuth users
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        provider: {
            type: DataTypes.ENUM('local', 'google', 'github'),
            defaultValue: 'local'
        },
        providerId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        plan: {
            type: DataTypes.ENUM('free', 'pro', 'enterprise'),
            defaultValue: 'free'
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password') && user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    // Instance method to check password
    User.prototype.matchPassword = async function(enteredPassword) {
        if (!this.password) return false;
        return await bcrypt.compare(enteredPassword, this.password);
    };

    return User;
};

// Sync the User model to database
const syncUserModel = async () => {
    if (User) {
        await User.sync({ alter: true });
        console.log('✅ User table synced');
    }
};

const getUser = () => User;

module.exports = { initUserModel, getUser, syncUserModel };
