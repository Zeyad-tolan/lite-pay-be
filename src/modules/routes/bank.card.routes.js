import {Router} from "express";
import { authentication, authorization } from "../../middlewares/auth.middlewares.js";
import { fetchMyAccounts, fetchMyCards, fetchRelatedTransactions, fetchTransactions } from "../controllers/bank.card.controllers.js";

const bankCardsRouter=Router();

// fetch my accounts
bankCardsRouter.get("/accounts",authentication,authorization(["owner"]),fetchMyAccounts);

// fetch my cards
bankCardsRouter.get("/cards",authentication,authorization(["owner"]),fetchMyCards);

// fetch my transactions
bankCardsRouter.get("/transactions",authentication,authorization(["owner"]),fetchTransactions);

// fetch relatedTransactions
bankCardsRouter.get("/related-transactions/:transactionId",authentication,authorization(["owner"]),fetchRelatedTransactions);

export default bankCardsRouter;