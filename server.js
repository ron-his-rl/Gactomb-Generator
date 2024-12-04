const path = require("path");
const formidable = require('formidable');
const fastify = require("fastify")({  // Require the fastify framework and instantiate it
  logger: false,  // set this to true for detailed logging:
});
fastify.register(require('fastify-multipart'), { //enable multipart form data
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 1000000, // Max field value size in bytes
    fields: 10,         // Max number of non-file fields
    fileSize: 1000000,   // For multipart forms, the max file size
    files: 1,           // Max number of file fields
    headerPairs: 2000   // Max number of header key=>value pairs
  }
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {
    greeting: "Gactomb Generator",
  };
  // request.query.paramName <-- a querystring example
  return reply.view("/src/pages/index.hbs", params);
});

// A POST route to handle form submissions
fastify.post("/fileupload", async function (request, reply) {
  const data = await request.saveRequestFiles()
  reply.send(data[0].filename + ' uploaded to ' + data[0].filepath);

});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
