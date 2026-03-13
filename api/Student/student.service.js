const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // Insert Student
  insertStudent: (student, callback) => {
    pool.query(
      `
      INSERT INTO student
      (
        std_name,
        std_age,
        std_email,
        std_mobile_no,
        std_address,
        std_dep_id,
        std_program_id,
        std_program_year,
        std_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        student.std_name,
        student.std_age,
        student.std_email,
        student.std_mobile_no,
        student.std_address,
        student.std_dep_id,
        student.std_program_id,
        student.std_program_year,
        student.std_status,
      ],
      (err, result) => {
        if (err) {
          console.error("insertStudent DB error:", err);
          return callback(err, null);
        }

        return callback(null, {
          std_id: result.insertId,
        });
      },
    );
  },

  // Fetch All Students
  fetchAllStudents: (callback) => {
    pool.query(
      `
      SELECT
        s.*,
        pm.program_name,
        py.program_year_name
      FROM student s
      LEFT JOIN program_master pm
      ON pm.program_id = s.std_program_id
      LEFT JOIN program_year_master py
      ON py.prgm_mast_dtl_slno = s.std_program_year
      `,
      [],
      (err, rows) => {
        if (err) {
          console.error("fetchAllStudents DB error:", err);
          return callback(err, null);
        }

        return callback(null, rows);
      },
    );
  },

  // Fetch Student By ID
  fetchStudentById: (id, callback) => {
    pool.query(`SELECT * FROM student WHERE std_id = ?`, [id], (err, rows) => {
      if (err) {
        console.error("fetchStudentById DB error:", err);
        return callback(err, null);
      }

      return callback(null, rows[0]);
    });
  },

  // Update Student
  updateStudent: (student, callback) => {
    pool.query(
      `
      UPDATE student
      SET
        std_name = ?,
        std_age = ?,
        std_email = ?,
        std_mobile_no = ?,
        std_address = ?,
        std_dep_id = ?,
        std_program_id = ?,
        std_program_year = ?,
        std_status = ?,
        edit_date = NOW()
      WHERE std_id = ?
      `,
      [
        student.std_name,
        student.std_age,
        student.std_email,
        student.std_mobile_no,
        student.std_address,
        student.std_dep_id,
        student.std_program_id,
        student.std_program_year,
        student.std_status,
        student.std_id,
      ],
      (err, result) => {
        if (err) {
          console.error("updateStudent DB error:", err);
          return callback(err, null);
        }

        return callback(null, result);
      },
    );
  },
};
