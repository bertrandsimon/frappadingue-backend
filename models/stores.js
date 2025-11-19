const mongoose = require("mongoose");

const storeSchema = mongoose.Schema({
  city: String,
  address: String,
  postalCode: String,
  phoneContact: String,
  photoUrl: String,
  desc: String,
  email: String,
  bossName: String,
  storeTypes: Array,
  editorialTitle: String,
  editorialText: String,
  editorialPhoto: String,
  storeName: String,
  adherent: String,
});

// Add indexes for frequently queried fields
storeSchema.index({ postalCode: 1 }); // For postal code searches
storeSchema.index({ storeName: 1 }); // For store name lookups

const Store = mongoose.model("stores", storeSchema);

module.exports = Store;
