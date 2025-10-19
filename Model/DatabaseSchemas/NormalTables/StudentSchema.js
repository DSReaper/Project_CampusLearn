// ../DatabaseSchemas/NormalTables/StudentSchema.js
"use strict";

// Export a MongoDB validator using $jsonSchema
const StudentSchema = {
  $jsonSchema: {
    bsonType: "object",
    description: "Schema for student entity",
    required: [
      "StudentID",
      "DegreeID",
      "FirstName",
      "LastName",
      "Email",
      "Status",
      "Online",
    ],
    additionalProperties: false,
    properties: {
      // IMPORTANT: allow _id since additionalProperties is false
      _id: { bsonType: "objectId", description: "MongoDB document id" },

      StudentID: {
        // allow 32- or 64-bit integers
        bsonType: ["int", "long"],
        description: "Primary key for student",
        minimum: 1,
      },
      DegreeID: {
        bsonType: ["int", "long"],
        description: "Foreign key reference to Degree",
      },
      FirstName: {
        bsonType: "string",
        description: "First name of the student",
        minLength: 2,
        maxLength: 50,
      },
      LastName: {
        bsonType: "string",
        description: "Last name of the student",
        minLength: 2,
        maxLength: 50,
      },
      Email: {
        bsonType: "string",
        description: "Unique email address of the student",
        // exact format you’re using: {StudentID}@student.belgiumcampus.ac.za
        pattern: "^[0-9]+@student\\.belgiumcampus\\.ac\\.za$",
      },
      Password: {
        bsonType: "string",
        description: "Password (or bcrypt hash)",
        minLength: 8,
        maxLength: 100,
      },
      Status: {
        bsonType: "string",
        description: "Enrollment status",
        enum: ["Active", "Inactive", "Suspended"],
      },
      Online: {
        bsonType: "bool",
        description: "Whether the student is currently online",
      },
    },
  },
};

module.exports = { StudentSchema };
