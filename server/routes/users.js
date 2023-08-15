import express from "express";
import{
    getUser,
    getUserFriends,
    addRemoveFriend,
    getCollegeFeed,
}from "../controllers/users.js";
import{verifyToken}from "../middleware/auth.js";

const router=express.Router();

/*Read*/
router.get("/:id",verifyToken,getUser);
router.get("/:id/friends",verifyToken,getUserFriends);
router.get("/id/collegeFeed",verifyToken,getCollegeFeed);

/*UPDATE*/
router.patch("/:id/:friendId",verifyToken,addRemoveFriend);
export default router;

