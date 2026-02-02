const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Missing id." }),
      };
    }

    const result = await dynamo
      .get({
        TableName: TABLE_NAME,
        Key: { id },
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Not found." }),
      };
    }

    const item = result.Item;
    if (item.expiresAt && Math.floor(Date.now() / 1000) > item.expiresAt) {
      return {
        statusCode: 410,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Expired." }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ questions: item.questions }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Server error." }),
    };
  }
};
