// Relax numeric fields to accept int/long/double (Node inserts doubles by default)
const StudentValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "StudentID",
      "DegreeID",
      "FirstName",
      "LastName",
      "Email",
      "PasswordHash",
      "Status",
      "Online",
    ],
    additionalProperties: false,
    properties: {
      StudentID: {
        bsonType: ["int", "long", "double"],
        description: "Student numeric ID",
      },
      DegreeID: {
        bsonType: ["int", "long", "double"],
        description: "Degree numeric ID",
      },
      FirstName: { bsonType: "string", minLength: 2, maxLength: 50 },
      LastName: { bsonType: "string", minLength: 2, maxLength: 50 },
      Email: {
        bsonType: "string",
        pattern: "^[0-9]+@student\\.belgiumcampus\\.ac\\.za$",
      },
      PasswordHash: { bsonType: "string", minLength: 20, maxLength: 200 },
      Status: { bsonType: "string", enum: ["Active", "Inactive", "Suspended"] },
      Online: { bsonType: "bool" },
      CreatedAt: { bsonType: "date" },
      UpdatedAt: { bsonType: "date" },
    },
  },
};

module.exports = { StudentValidator };
