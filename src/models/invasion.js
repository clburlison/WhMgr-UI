'use strict';

const { DataTypes, Model, } = require('sequelize');
const sequelize = require('../services/sequelize.js')(true);

class Invasion extends Model {

    static getCount(guildId, userId) {
        return Invasion.count({
            where: {
                guildId: guildId,
                userId: userId,
            }
        });
    }

    static async create(invasions) {
        if (invasions.length === 0) {
            return;
        }
        const results = await Invasion.bulkCreate(invasions, {
            updateOnDuplicate: Invasion.fromInvasionFields,
        });
        console.log('[Invasion] Results:', results);
    }

    static getAll(guildId, userId) {
        return Invasion.findAll({
            where: {
                guildId: guildId,
                userId: userId,
            }
        });
    }

    static getById(id) {
        return Invasion.findByPk(id);
    }

    static getBy(guildId, userId, pokestopName, gruntType, rewardPokemonId) {
        return Invasion.findOne({
            where: {
                guildId: guildId,
                userId: userId,
                pokestopName: pokestopName,
                gruntType: gruntType,
                rewardPokemonId: rewardPokemonId,
            }
        });
    }

    static delete(guildId, userId, rewardPokemonId) {
        return Invasion.destroy({
            where: {
                guildId: guildId,
                userId: userId,
                rewardPokemonId: rewardPokemonId,
            }
        });
    }

    static deleteById(id) {
        return Invasion.destroy({
            where: {
                id: id,
            }
        });
    }

    static deleteAll(guildId, userId) {
        return Invasion.destroy({
            where: {
                guildId: guildId,
                userId: userId,
            }
        });
    }
}

Invasion.init({
    id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    subscriptionId: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
    },
    guildId: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
    },
    userId: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
    },
    pokestopName: {
        type: DataTypes.STRING(128),
        allowNull: true,
        //unique: true,
    },
    gruntType: {
        type: DataTypes.INTEGER(2).UNSIGNED,
        allowNull: true,
    },
    rewardPokemonId: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: true,
    },
    city: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: '[]',
        get() {
            var data = this.getDataValue('city');
            return Array.isArray(data)
                ? data
                : JSON.parse(data || '[]');
        },
    },
    location: {
        type: DataTypes.STRING(32),
        defaultValue: null,
    },
}, {
    sequelize,
    timestamps: false,
    underscored: true,
    indexes: [
        {
            name: 'FK_invasion_subscriptions_subscription_id',
            fields: ['subscription_id'],
        },
    ],
    tableName: 'invasions',
});

module.exports = Invasion;