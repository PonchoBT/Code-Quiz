const AWS = require("aws-sdk");
const crypto = require("crypto");

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

function isValidQuestion(item) {
  return (
    item &&
    typeof item.question === "string" &&
    Array.isArray(item.answer_btn) &&
    item.answer_btn.length === 5 &&
    typeof item.answer === "string"
  );
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const questions = body.questions;
    if (!Array.isArray(questions) || questions.length !== 5) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Invalid questions." }),
      };
    }
    if (!questions.every(isValidQuestion)) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Invalid question format." }),
      };
    }

    const id = crypto.randomBytes(6).toString("hex");
    const expiresAt = Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60;

    await dynamo
      .put({
        TableName: TABLE_NAME,
        Item: {
          id,
          questions,
          expiresAt,
        },
      })
      .promise();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Server error." }),
    };
  }
};
