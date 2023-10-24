const amqp = require("amqplib");

async function subscribeToProductCreationEvent() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = "product_events";
  const queueName = "notification_queue";
  const routingKey = "product.created";

  await channel.assertExchange(exchangeName, "direct", { durable: true });
  const q = await channel.assertQueue(queueName, { durable: true });
  channel.bindQueue(q.queue, exchangeName, routingKey);

  console.log("Waiting for product creation events...");

  channel.consume(
    q.queue,
    (message) => {
      const product = message.content.toString();
      console.log("Received product creation event:", product);
    },
    { noAck: true }
  );
}

subscribeToProductCreationEvent();
