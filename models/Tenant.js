import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Tenant = sequelize.define('Tenant', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    
    // --- Vertical Identification ---
    organizationType: {
        type: DataTypes.ENUM('school', 'college', 'university', 'coaching', 'preschool', 'other'),
        allowNull: false,
        defaultValue: 'school',
    },

    // --- Branding & Identity ---
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { len: [3, 255] }
    },
    officialEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    subdomain: {
        type: DataTypes.STRING(63),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[a-z0-9-]+$/i,
            notIn: [['admin', 'www', 'api', 'support', 'billing', 'master']]
        }
    },

    // --- Dynamic Configuration ---
    settings: {
        type: DataTypes.JSONB,
        defaultValue: {
            timezone: 'Asia/Kolkata',
            currency: 'INR'
        }
    },

    address: {
        type: DataTypes.JSONB,
        defaultValue: {}
    },

    contactInfo: {
        type: DataTypes.JSONB,
        defaultValue: {}
    },

    themeConfig: {
        type: DataTypes.JSONB,
        defaultValue: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1E40AF',
            accentColor: '#0F172A',
            fontFamily: 'Inter'
        }
    },

    brandingAssets: {
        type: DataTypes.JSONB,
        defaultValue: {
            logoUrl: null,
            faviconUrl: null,
            coverImageUrl: null
        }
    },

    portalUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },

    registrationNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // --- Lifecycle ---
    status: {
        type: DataTypes.ENUM('onboarding', 'active', 'suspended', 'archived'),
        defaultValue: 'onboarding'
    },
    customFields: {
        type: DataTypes.JSONB,
        defaultValue: {}
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {}
    }
}, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: 'tenants',
    hooks: {
      beforeDestroy: async (tenant, options) => {
        const suffix = `_DELETED_${Date.now()}`;
        if (tenant.officialEmail) {
          tenant.officialEmail = tenant.officialEmail.slice(0, 255 - suffix.length) + suffix;
        }
        if (tenant.subdomain) {
          tenant.subdomain = tenant.subdomain.slice(0, 63 - suffix.length) + suffix;
        }
        await tenant.save({ transaction: options.transaction, hooks: false, validate: false });
      }
    }
});

export default Tenant;
