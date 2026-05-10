const express =
  require("express")



const router =
  express.Router()



const authMiddleware =
  require(
    "../middlewares/auth.middleware"
  )



const notificationController =
  require(
    "../controllers/notification.controller"
  )



router.get(

  "/",

  authMiddleware.authUserMiddleware,

  notificationController.getNotifications

)



module.exports =
  router