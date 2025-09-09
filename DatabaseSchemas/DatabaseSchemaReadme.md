# CampusLearn™ Database Normalization

This document outlines the normalization process for the CampusLearn™ schema, progressing from **Unnormalized Form (UNF)** to **Third Normal Form (3NF)**. The purpose is to eliminate redundancy, maintain consistency, and align with the business rules of the system.

---

## Step 1: UNF → 1NF (Atomicity)

**UNF Example – Lecturer (repeating group):**

| LecturerID | LecturerNo | FirstName | LastName | Email             | Modules Taught              |
|------------|------------|-----------|----------|-------------------|-----------------------------|
| L01        | 896045     | Jan       | Moyo     | jmoyo@campus.ac.za| {MLG381, MLG382, LPR281}    |

Problem: *Modules Taught* contains multiple values → violates 1NF.  

**Conversion to 1NF (separate junction table):**

- `Lecturer(LecturerID, LecturerNo, FirstName, LastName, Email)`  
- `LecturerModule(LecturerID, ModuleID)`

**1NF Example – LecturerModule:**

| LecturerID | ModuleID |
|------------|----------|
| L01        | MLG381   |
| L01        | MLG382   |
| L01        | LPR281   |

✔ Each attribute is atomic.

---

## Step 2: 1NF → 2NF (No Partial Dependencies)

**Problematic 1NF Example – ChatRoomParticipant:**

| ChatRoomID | StudentID | Role     | JoinedAt   | FirstName |
|------------|-----------|----------|------------|-----------|
| CR01       | S10       | Member   | 2025-01-16 | John      |
| CR01       | S18       | Owner    | 2025-01-12 | Sarah     |

 *FirstName* depends only on `StudentID`, not the full key (`ChatRoomID`, `StudentID`).  

**Conversion to 2NF:**
- `ChatRoomParticipant(ChatRoomID, StudentID, Role, JoinedAt)`  
- `Student(StudentID, FirstName, LastName, DegreeID, Email, Status, Online)`

**2NF Example – ChatRoomParticipant:**

| ChatRoomID | StudentID | Role     | JoinedAt   |
|------------|-----------|----------|------------|
| CR01       | S10       | Member   | 2025-01-16 |
| CR01       | S18       | Owner    | 2025-01-12 |

✔ Non-key attributes depend on the full composite key.

---

##  Step 3: 2NF → 3NF (No Transitive Dependencies)

**2NF Example – Module table with embedded details:**

| ModuleID | ModuleNo | ModuleName       | ClusterID | ClusterName   | DegreeID | DegreeName |
|----------|----------|------------------|-----------|---------------|----------|------------|
| M01      | MLG381   | Machine Learning | C01       | Mathematical  | D01      | BComp      |

 `ClusterName` depends on `ClusterID` and `DegreeName` depends on `DegreeID` → transitive dependencies.

**Conversion to 3NF:**
- `Module(ModuleID, ModuleNo, ModuleName, Description, ClusterID, DegreeID)`  
- `Cluster(ClusterID, Name, Description)`  
- `Degree(DegreeID, DegreeName, NQFLevel)`

**3NF Example – Module:**

| ModuleID | ModuleNo | ModuleName       | ClusterID | DegreeID |
|----------|----------|------------------|-----------|----------|
| M01      | MLG381   | Machine Learning | C01       | D01      |

All non-key attributes depend directly on the primary key.

---

## Integrity Rules
- **Entity integrity:** Each table has a unique primary key.  
- **Referential integrity:** Foreign keys maintain valid references (e.g., `Student.DegreeID → Degree.DegreeID`).  
- **Domain integrity:** Constraints enforce unique identifiers (StudentNo, Email, ModuleNo) and valid categories (LearningMaterial.Type).

---

##  Final Normalized Relations (3NF)

```plaintext
Student(StudentID, DegreeID, StudentNo, FirstName, LastName, Email, Status, Online)
Tutor(TutorID, StudentID)
Degree(DegreeID, DegreeName, NQFLevel)
Cluster(ClusterID, Name, Description)
Lecturer(LecturerID, LecturerNo, FirstName, LastName, Email)
Classroom(ClassroomID, ClassroomName)
Module(ModuleID, ClusterID, DegreeID, ModuleNo, ModuleName, Description)
LecturerModule(LecturerID, ModuleID)
LecturerCluster(LecturerID, ClusterID)
LecturerClassroom(LecturerID, ClassroomID)
ChatRoom(ChatRoomID, ModuleID, CreatedByStudentID, Title, Description)
ChatRoomParticipant(ChatRoomID, StudentID, Role, JoinedAt)
LearningMaterial(MaterialID, Type, Title, URL, UploadedByStudentID, UploadedAt)
ChatRoomChats(ChatID, ChatRoomID, SenderStudentID, Body, LearningMaterialID, CreatedAt)
```

---

![ERD](images/ERD.png)
