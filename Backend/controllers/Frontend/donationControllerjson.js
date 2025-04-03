// Load environment variables
require("dotenv").config();

// Log environment variables to check if they are loaded correctly
console.log("PayPal Client ID:", process.env.PAYPAL_CLIENT_ID);
console.log("PayPal Client Secret:", process.env.PAYPAL_CLIENT_SECRET);

// Import necessary modules and configurations
const paypal = require("@paypal/checkout-server-sdk");
const Donations = require("../../schemas/donations");
const Donors = require("../../schemas/donors"); // Ensure this is the correct path
const Entities = require("../../schemas/entities");

// PayPal client setup
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal client ID or secret");
  }

  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

const paypalClient = client();

// Initialize the donation controller
const doacaoController = {};

// Create PayPal payment
doacaoController.createPaypalPayment = async (req, res) => {
  const { amount } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount,
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    res.status(201).json({
      id: order.result.id,
      status: order.result.status,
      links: order.result.links,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating PayPal payment");
  }
};

// Execute PayPal payment
doacaoController.executePaypalPayment = async (req, res) => {
  const { paymentId } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(paymentId);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);
    res.status(200).json({
      status: capture.result.status,
      id: capture.result.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error capturing PayPal payment");
  }
};

// Create donation
// Helper function to validate email, entity, color, and type
async function validateEmailAndEntity(email, entity) {
  const donor = await Donors.findOne({ email });
  const entityDoc = await Entities.findOne({ name: entity });

  if (!donor) {
    throw new Error("Donor not found");
  }
  if (!entityDoc) {
    throw new Error("Entity not found");
  }
}

function validateClothDonation(clothDonations) {
  const minFourLettersRegex = /^.{4,}$/;

  for (const clothDonation of clothDonations) {
    if (!minFourLettersRegex.test(clothDonation.color)) {
      throw new Error("Color must be at least 4 characters long");
    }
    if (!minFourLettersRegex.test(clothDonation.type)) {
      throw new Error("Type must be at least 4 characters long");
    }
  }
}

// Create donation
doacaoController.createDoacao = async (req, res) => {
  try {
    const { donorEmail, entity, paymentId, payerId, amount, clothDonations } =
      req.body;

    // Validate email and entity
    try {
      await validateEmailAndEntity(donorEmail, entity);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // Validate amount
    if (amount < 1) {
      return res.status(400).json({ error: "Amount must be at least 1" });
    }

    // Validate cloth donations
    if (clothDonations && clothDonations.length > 0) {
      try {
        validateClothDonation(clothDonations);
      } catch (validationError) {
        return res.status(400).json({ error: validationError.message });
      }
    }

    // Capture PayPal payment if necessary
    if (paymentId && payerId) {
      const request = new paypal.orders.OrdersCaptureRequest(paymentId);
      request.requestBody({});

      try {
        const capture = await paypalClient.execute(request);
        console.log("Payment captured:", capture);
      } catch (err) {
        if (
          err.statusCode === 422 &&
          err.message.includes("ORDER_ALREADY_CAPTURED")
        ) {
          console.log("Order already captured, proceeding with donation.");
        } else {
          console.error("Error capturing PayPal payment:", err);
          return res
            .status(500)
            .json({ error: "Error capturing PayPal payment" });
        }
      }
    }

    let newDonation = [];

    if (clothDonations && clothDonations.length > 0) {
      newDonation = clothDonations.map((clothDonation) => ({
        type: "cloth",
        kg: clothDonation.weight,
        color: clothDonation.color,
        clothType: clothDonation.type,
        state: clothDonation.state, // Ensure the state is included here
        points: clothDonation.weight * 2,
      }));
    } else if (amount) {
      newDonation.push({
        type: "money",
        quantity: amount,
        points: amount * 2,
      });
    }

    // Save donation to Donations collection
    const existingDonation = await Donations.findOne({ donorEmail, entity });
    if (existingDonation) {
      existingDonation.donations =
        existingDonation.donations.concat(newDonation);
      await existingDonation.save();
    } else {
      const donation = new Donations({
        donorEmail,
        entity,
        donations: newDonation,
      });
      await donation.save();
    }

    // Save donation to Entities collection
    const entityDoc = await Entities.findOne({ name: entity });
    if (!entityDoc) {
      return res.status(404).json({ error: "Entity not found" });
    }

    if (!entityDoc.donations) {
      entityDoc.donations = [];
    }

    const entityDonation = newDonation.map((donation) => ({
      ...donation,
      donorEmail: donorEmail,
    }));

    entityDoc.donations = entityDoc.donations.concat(entityDonation);
    await entityDoc.save();

    // Update donor points
    const donor = await Donors.findOne({ email: donorEmail });
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    const points = newDonation.reduce((acc, item) => acc + item.points, 0);

    await Donors.findByIdAndUpdate(
      donor._id,
      { $inc: { points: points } },
      { new: true }
    );

    res.status(201).json("Donation successful");
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// List donations
doacaoController.listDoacoes = async (req, res) => {
  try {
    const doacoes = await Donations.find();
    const formattedDoacoes = doacoes.map((doacao) => ({
      _id: doacao._id,
      donorEmail: doacao.donorEmail,
      entityName: doacao.entity,
      donations: doacao.donations,
      // Add any other fields you need here
    }));

    console.log("Doações encontradas:", formattedDoacoes);
    res.status(200).json({ donations: formattedDoacoes });
  } catch (error) {
    console.error("Erro ao listar doações:", error);
    res.status(500).json({ error: "Erro ao listar doações." });
  }
};

// Update donation state
doacaoController.updateState = async (req, res) => {
  console.log(
    "updateState called with entity name:",
    req.params.entityName,
    "and index:",
    req.params.index
  );
  try {
    const entityName = req.params.entityName;
    const donationIndex = req.params.index;
    const newState = req.body.state;

    const entity = await Entities.findOne({ name: entityName });
    if (!entity) {
      return res.status(404).json({ error: "Entity not found" });
    }

    if (!entity.donations || !entity.donations[donationIndex]) {
      return res.status(404).json({ error: "Donation not found" });
    }

    // Update the state of the specific donation item
    entity.donations[donationIndex].state = newState;
    await entity.save();

    res.status(200).json({ message: "Donation state updated successfully" });
  } catch (error) {
    console.error("Error updating donation state:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = doacaoController;
