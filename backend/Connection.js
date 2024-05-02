import mongoose from "mongoose";

class Connection {
  constructor(
    uri = "mongodb+srv://warusus:xlJJroAKnDZRSQHD@clusterdmytrii.xzcilih.mongodb.net/dipl_proj?retryWrites=true&w=majority&appName=ClusterDmytrii",
    clientOptions = {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    }
  ) {
    this.uri = uri;
    this.clientOptions = clientOptions;
  }

  async connect() {
    try {
      await mongoose.connect(this.uri, this.clientOptions);
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log("Connected to MongoDB!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB!");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  }

  // single document methods by conditions ({ key: value })

  async addDocument(model, data) {
    try {
      const document = await model.create(data);
      console.log("Document added successfully:", document);
      return document;
    } catch (error) {
      console.error("Error adding document:", error);
    }
  }

  async updateDocument(model, conditions, update) {
    try {
      const document = await model.findOneAndUpdate(conditions, update, {
        new: true,
      });
      console.log("Document updated successfully:", updatedDocument);
      return document;
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  async deleteDocument(model, conditions) {
    try {
      const document = await model.findOneAndDelete(conditions);
      console.log("Document deleted successfully:", deletedDocument);
      return document;
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  async getDocument(model, conditions) {
    try {
      const document = await model.findOne(conditions);
      return document;
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

  // single document methods by id

  async deleteDocumentById(model, document_id) {
    try {
      const document = await model.findByIdAndDelete(document_id);
      return document;
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  async updateDocumentById(model, document_id, update) {
    try {
      const document = await model.findByIdAndUpdate(document_id, update);
      return document;
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  async getDocumentById(model, document_id) {
    try {
      const document = await model.findById(document_id);
      return document;
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

  // many documents methods by conditions

  async addDocuments(model, data) {
    try {
      const documentList = await model.insertMany(data);
      console.log("Documents added successfully:", documentList);
      return documentList;
    } catch (error) {
      console.error("Error adding documents:", error);
    }
  }

  async getDocuments(model, conditions) {
    try {
      const documentList = await model.find(conditions);
      return documentList;
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  }

  async updateDocuments(model, conditions, update) {
    try {
      const documentList = await model.updateMany(conditions, update);
      return documentList;
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  }

  async deleteDocuments(model, conditions) {
    try {
      const documentList = await model.deleteMany(conditions);
      return documentList;
    } catch (error) {
      console.error("Error deleting documents:", error);
    }
  }
}

const db = new Connection()
export default db;