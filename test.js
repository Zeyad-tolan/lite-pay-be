import fs from "fs";
import { cardModel, credentialModel, userModel } from "./db/dbConnection.js";


// const getUsers=()=>{
//   let data=[];
//   let users=fs.readFileSync("user-data.json", "utf-8");
//   let credits=fs.readFileSync("user.json", "utf-8");
//   JSON.parse(credits).forEach((credit)=>{
//     delete credit.createdAt;
//     delete credit.updatedAt;
//     let user=JSON.parse(users).find((user)=> credit.userId==user.id);
//     delete user.createdAt;
//     delete user.updatedAt;
//     data.push({...user,credit:{
//       ...credit
//     }});
//   })
//   fs.writeFileSync("combined-user.json", JSON.stringify(data, null, 2), "utf-8");
// }

// getUsers();


// const addUser=()=>{
//   let combinedData=fs.readFileSync("combined-user.json", "utf-8");
//   let data=JSON.parse(combinedData);
//   data.forEach(async(user)=>{
//     const result=await userModel.create({
//       "id": user.id,
//     "email": user.email,
//     "username": user.username,
//     "roleId": user.roleId,
//     "status": user.status,
//     })
//     if(result){
//       await credentialModel.create({
//         "id": user.credit.id,
//       "password": user.credit.password,
//       "userId": user.id
//       })
//     }
//   })
// }

// addUser();

const addCards = async () => {
  try {
    let cards = fs.readFileSync("cards.json", "utf-8");
    let data = JSON.parse(cards);

    for (const card of data) {
      // Check if user exists
      const userExists = await userModel.findByPk(card.userId);

      if (!userExists) {
        console.log(`Skipping card insertion for non-existing userId: ${card.userId}`);
        continue; // Skip this card
      }

      // Insert card if user exists
      await cardModel.create({
        id: card.id,
        bankId: card.bankId,
        cardNumber: card.cardNumber,
        cvv: card.cvv,
        name: card.name,
        expiryDate: card.expireDate,
        type: card.type,
        userId: card.userId,
        balance: card.balance,
        status: card.status,
      });

      console.log(`Card added for userId: ${card.userId}`);
    }

    console.log("Card insertion process completed.");
  } catch (error) {
    console.error("Error adding cards:", error);
  }
};

addCards();