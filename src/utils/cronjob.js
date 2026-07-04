// const cron = require("node-cron");
// const ConnectionRequestModel = require("../models/connectionRequest");
// const { subDays, startOfDay, endOfDay } = require("date-fns");
// const sendEmail = require("./sendEmail");

// cron.schedule("2 18 * * *", async () => {
//     console.log("Hello World " + new Date());
//     //Send emails to all people who got requests the previous day

//     try {
//         const { subDays } = require("date-fns")
//         const yesterday = (new Date(), 1);
//         const yesterdayStart = startOfDay(yesterday);
//         const endOfDay = endOfDay(yesterday);
//         const pendingRequest = await ConnectionRequestModel.find({
//             status: "interested",
//             createdAt: {
//                 $gte: yesterdayStart,
//                 $ne: endOfDay

//             }
//         }).populate("fromUserId toUserId");
//         const listOfEmails = [...new Set(pendingRequest.schemaLevelProjections(req => req.touserId.emailId))]
//         for (const email of listOfEmails) {
//             try {

//                 const emailRes = await sendEmail.run(
//                     "New Friend Request Pending",
//                     `There are new friend requests pending for ${toEmailId}. Please log in and approve or reject them.`
//                 );
//                 console.log("res", emailRes)

//             } catch (err) {
//                 console.log(err)
//             }
//         }
//     } catch (err) {

//         console.log(err)
//     }
// });

const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

cron.schedule(
  "5 18 * * *",
  async () => {
    console.log("Cron started:", new Date());

    try {
      const yesterday = subDays(new Date(), 1);
      const yesterdayStart = startOfDay(yesterday);
      const yesterdayEnd = endOfDay(yesterday);

      const pendingRequests = await ConnectionRequestModel.find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lte: yesterdayEnd,
        },
      }).populate("fromUserId toUserId");

      const listOfEmails = [
        ...new Set(
          pendingRequests
            .map((req) => req.toUserId?.emailId)
            .filter(Boolean)
        ),
      ];

      for (const email of listOfEmails) {
        try {
          const emailRes = await sendEmail.run(
            email,
            "New Friend Request Pending",
            `There are new friend requests pending for ${email}. Please log in and approve or reject them.`
          );

          console.log("Email sent:", emailRes);
        } catch (err) {
          console.log("Email error:", err.message);
        }
      }
    } catch (err) {
      console.log("Cron error:", err.message);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);