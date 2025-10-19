const TutorSchema = {
  $jsonSchema: {
    bsonType: "object",
    title: "Tutor",
    description: "Schema for tutor entity (a student who acts as a tutor)",
    required: ["TutorID", "StudentID"],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId",
        description: "Auto-generated ObjectId for the tutor document",
      },
      TutorID: {
        bsonType: ["int", "long"],
        description: "Primary key for tutor",
        minimum: 1,
      },
      StudentID: {
        bsonType: ["int", "long"],
        description: "Foreign key reference to the Student",
      },
    },
  },
};

module.exports = { TutorSchema };