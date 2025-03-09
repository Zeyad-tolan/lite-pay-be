import pg from "pg";
import { DataTypes, Sequelize } from "sequelize";
import * as models from "./import.db.js"
import env from "dotenv";
env.config();

/*
 - sequelize is a library that helps us to connect to our database
 - we use env variables to connect to our database
 - it's an instance of the Sequelize class
*/
// export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//   host: 'localhost',
//   dialect: 'postgres',
// });
export const sequelize = new Sequelize(process.env.Db_Ext_Url, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// start migration
export const userModel = models.userModelDefinition(sequelize, Sequelize);
export const roleModel = models.roleModelDefinition(sequelize, Sequelize);
export const credentialModel = models.credentialModelDefinition(sequelize, Sequelize);
export const cardModel=models.cardModelDefination(sequelize,DataTypes);
export const requestModel=models.requestModelDefinition(sequelize,DataTypes);
export const transactionModel=models.transactionModelDefinition(sequelize,DataTypes);
export const cardPriceModel=models.cardPriceModelDefination(sequelize,DataTypes);
export const promoModel=models.promoModelDefination(sequelize,DataTypes);
export const ratingModel=models.ratingModelDefination(sequelize,DataTypes);

export const allModels = {userModel, roleModel, credentialModel,cardModel,requestModel,transactionModel,cardPriceModel,promoModel,ratingModel};
// end migration


// relations
roleModel.hasMany(userModel, { foreignKey: 'roleId' });
userModel.belongsTo(roleModel, { foreignKey: 'roleId' });
userModel.hasOne(credentialModel, { foreignKey: 'userId' });
userModel.hasMany(cardModel,{foreignKey:"userId"});
cardModel.belongsTo(userModel,{foreignKey:"userId"});
userModel.hasMany(requestModel,{foreignKey:"userId"});
requestModel.belongsTo(userModel,{foreignKey:"userId"});
cardModel.hasMany(requestModel,{foreignKey:"cardId"});
requestModel.belongsTo(cardModel,{foreignKey:"cardId"});
cardModel.hasMany(transactionModel,{foreignKey:"cardId"});
transactionModel.belongsTo(cardModel,{foreignKey:"cardId"});
// end relations





/**
 * Syncs the database by recreating all tables if they don't exist.
 * If they do exist, it will attempt to alter them to match the current models.
 * @returns {Promise<void>}
 */
export const syncDb = async (options) => {
  try {
    await sequelize.sync(options);
    console.log("Database synced");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export function fireDbConnection() {
  return sequelize.authenticate();
}

export default async function monitorDbConnection(attempt = 1) {
  try {
    await fireDbConnection();
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error(`❌ Database connection failed (Attempt ${attempt}):`, error.message);

    if (attempt < 3) {
      console.log(`🔄 Retrying connection in 5 seconds...`);
      setTimeout(() => monitorDbConnection(attempt + 1), 5000);
    } else {
      console.log("🚨 Maximum retries reached. Restarting server...");
      exec("pm2 restart all", (err, stdout, stderr) => {
        if (err) {
          console.error(`❌ Failed to restart server: ${err.message}`);
          return;
        }
        console.log(`✅ Server restarted successfully: ${stdout}`);
      });
    }
  }
}

monitorDbConnection();
