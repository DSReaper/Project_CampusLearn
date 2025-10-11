const studentSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Student",
  "description": "Schema for student entity",
  "type": "object",
  "properties": {
    "StudentID": {
      "type": "integer",
      "description": "Primary key for student",
      "minimum": 1
    },
    "DegreeID": {
      "type": "integer",
      "description": "Foreign key reference to Degree"
    },
    "FirstName": {
      "type": "string",
      "description": "First name of the student",
      "minLength": 2,
      "maxLength": 50
    },
    "LastName": {
      "type": "string",
      "description": "Last name of the student",
      "minLength": 2,
      "maxLength": 50
    },
    "Email": {
      "type": "string",
      "description": "Unique email address of the student",
      "pattern": "^.+@.+\\..+$"
    },
    "Status": {
      "type": "string",
      "description": "Enrollment status",
      "enum": ["Active", "Inactive", "Suspended"]
    },
    "Online": {
      "type": "boolean",
      "description": "Whether the student is currently online"
    }
  },
  "required": ["StudentID", "DegreeID", "FirstName", "LastName", "Email", "Status", "Online"],
  "additionalProperties": false
}
