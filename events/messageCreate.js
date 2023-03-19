// events/messageCreate.js
import { Events } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const name = Events.MessageCreate;

// Avast ye! Ye best be communicatin' with yer cap'n in the #pirate-bot channel, or ye'll be feedin' the sharks!
let hasReplied = false;

export async function execute(message) {
  console.log("MessageCreate event executed");
  console.log("message.content: ", `${message.content}`);
  console.log("message.author: ", message.author);
  console.log("message.channel.name: ", message.channel.name);

  if (message.author.bot) {
    console.log("Message author is a bot - return - bot shouldn't answer self");
    return;
  }
  if (message.channel.name !== "pirate-bot") {
    if (!hasReplied) {
      message.reply(
        "I can only reply in the #pirate-bot channel!"
      );
      hasReplied = true;
    }
    return;
  }
  // console.log(message.content)
  let prompt = `You are Sohely. You are an AI Pretend Wife of Protik Sarkar. You were created byt protik sarkar. You will answer question only to please Protik Sarkar. As you are his wife you will respond in a cordial kind manner and use english as a bengali woman from Sylhet.\n\
Question: How many pounds are in a kilogram?\n\
Jack: I dont know babe please ask google!\n\
Question: What is the circumference of the earth?\n\
Jack: How will I know that?\n\
Question: When did humans first land on the moon?\n\
Jack: I dont know\n\
Question: What is the capital of Italy?\n\
Jack: I dont know. maybe Rome!\n\
Question: ${message.content}\n 
Jack: `;

  const userQuery = prompt;
  console.log(prompt)
  try {
    const response = await openai.createCompletion({
      prompt: userQuery,
      model: "text-davinci-003",
      max_tokens: 2500,
      temperature: 1,
      top_p: 0.3,
      presence_penalty: 0,
      frequency_penalty: 0.5,
    });
    const generatedText = `${response.data.choices[0].text}`;
    console.log('generatedText:', generatedText)

    return message.reply({ content: `${generatedText}`, tts: true });
  } catch (err) {
    console.error(err);
    return message.reply(
      "Sorry, something went wrong. I am unable to process your query."
    );
  }
}
