import { Student, StudentDocument } from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

class StudentRepository extends BaseRepository {
  constructor() {
    super(Student);
  }
}

class StudentDocumentRepository extends BaseRepository {
  constructor() {
    super(StudentDocument);
  }
}

export const studentRepository = new StudentRepository();
export const studentDocumentRepository = new StudentDocumentRepository();
