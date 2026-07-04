const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress,subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Text format",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

const run = async (subject,body,toEmailId) => {
  const sendEmailCommand = createSendEmailCommand(
      "biradarvishnu89@gmail.com",
      "biradarvishnu89@gmail.com",
      subject,
      body
  );

  try {
    const response = await sesClient.send(sendEmailCommand);
    console.log("Email sent:", response);
    return response;
  } catch (err) {
    console.error("SES Error:", err);
    throw err;
  }
};

module.exports = { run };