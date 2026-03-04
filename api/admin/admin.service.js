const pool = require("../../dbconfig/dbconfig");

module.exports = {
  insertAlumni: (alumni, callback) => {
    const {
      alum_name,
      alum_age,
      alum_company,
      alum_company_location,
      alum_company_designation,
      alum_experience,
      alum_qualification,
      alum_email,
      alum_status,
    } = alumni;

    pool.query(
      `
    INSERT INTO alumini (
      alum_name,
      alum_age,
      alum_company,
      alum_company_location,
      alum_company_designation,
      alum_experience,
      alum_qualification,
      alum_email,
      alum_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        alum_name,
        alum_age,
        alum_company,
        alum_company_location,
        alum_company_designation,
        alum_experience,
        alum_qualification,
        alum_email,
        alum_status,
      ],
      (error, result) => {
        if (error) {
          console.error("DB insertAlumni error:", error);
          return callback(error, null);
        }

        return callback(null, {
          alum_id: result.insertId,
        });
      },
    );
  },
  fetchAllAlumni: (callback) => {
    pool.query(
      `
      SELECT
        a.alum_id,
        a.alum_name,
        a.alum_age,
        a.alum_company,
        a.alum_company_location,
        a.alum_company_designation,
        a.alum_experience,
        a.alum_qualification,
        a.alum_status,
        a.alum_email,
        a.is_email_send,
        am.alum_username,
        am.alum_admin_approve
      FROM alumini a
      LEFT JOIN alumini_master am
        ON a.alum_id = am.alum_id
      ORDER BY a.create_date DESC
      `,
      (error, results) => {
        if (error) {
          console.error("DB fetchAllAlumni error:", error);
          return callback(error, null);
        }
        return callback(null, results);
      },
    );
  },
  fetchAllAlumniById: (data, callback) => {
    pool.query(
      `
      SELECT
        alum_id,
        alum_name,
        alum_age,
        alum_company,
        alum_company_location,
        alum_company_designation,
        alum_experience,
        alum_qualification,
        alum_status,
        alum_email,
        is_email_send
      FROM alumini
      where alum_id = ?
      `,
      [data.alumini_slno],
      (error, results) => {
        if (error) {
          console.error("DB fetchAllAlumni error:", error);
          return callback(error, null);
        }
        return callback(null, results);
      },
    );
  },
  updateAlumni: (id, alumni, callback) => {
    const {
      alum_name,
      alum_age,
      alum_company,
      alum_company_location,
      alum_company_designation,
      alum_experience,
      alum_qualification,
      alum_email,
      alum_status,
    } = alumni;

    pool.query(
      `
      UPDATE alumini
      SET 
        alum_name = ?,
        alum_age = ?,
        alum_company = ?,
        alum_company_location = ?,
        alum_company_designation = ?,
        alum_experience = ?,
        alum_qualification = ?,
        alum_email = ?,
        alum_status = ?
      WHERE alum_id = ?
      `,
      [
        alum_name,
        alum_age,
        alum_company,
        alum_company_location,
        alum_company_designation,
        alum_experience,
        alum_qualification,
        alum_email,
        alum_status,
        id,
      ],
      (error, result) => {
        if (error) {
          console.error("DB updateAlumni error:", error);
          return callback(error, null);
        }

        return callback(null, { alum_id: id });
      },
    );
  },
  InactiveAlumini: (data, callback) => {
    const { alumin_id } = data;
    pool.query(
      `
      UPDATE alumini
      SET 
        alum_status = 0
      WHERE alum_id = ?
      `,
      [alumin_id],
      (error, result) => {
        if (error) {
          console.error("DB updateAlumni error:", error);
          return callback(error, null);
        }

        return callback(null, { alum_id: alumin_id });
      },
    );
  },
  IsEmailSend: (data, callback) => {
    const { alum_id } = data;
    pool.query(
      `
      UPDATE alumini
      SET 
        is_email_send = 1
      WHERE alum_id = ?
      `,
      [alum_id],
      (error, result) => {
        if (error) {
          return callback(error, null);
        }

        return callback(null, { alum_id: alum_id });
      },
    );
  },
  InsertAluminMaster: (data, callback) => {
    const { alum_name, password, alum_id } = data;
    pool.query(
      `INSERT INTO alumini_master (alum_username, alum_password, alum_admin_approve, alum_id)
       VALUES (?, ?, ?, ?)`,
      [alum_name, password, 1, alum_id],
      (err, result) => {
        if (err) {
          console.error("insertUser DB error:", err);
          return callback(err, null);
        }

        return callback(null, { alumini_id: result.insertId });
      },
    );
  },
  insertdepDetail: (data, callback) => {
    const { dep_name, dep_status } = data;
    pool.query(
      `INSERT INTO department_master(dep_name, dep_status)
      VALUES (?, ?)`,
      [dep_name, dep_status],
      (err, result) => {
        if (err) {
          console.error("insert department_master DB error:", err);
          return callback(err, null);
        }

        return callback(null, { dep_id: result.insertId });
      },
    );
  },
  upatedepDetail: (data, callback) => {
    const { dep_id, dep_name, dep_status } = data;
    pool.query(
      `UPDATE department_master 
     SET dep_name = ?, 
         dep_status = ?
     WHERE dep_id = ?`,
      [dep_name, dep_status, dep_id],
      (err, result) => {
        if (err) {
          console.error("update department_master DB error:", err);
          return callback(err, null);
        }
        // Check if row actually updated
        if (result.affectedRows === 0) {
          return callback(null, { success: 0, message: "No record found" });
        }
        return callback(null, { success: 1 });
      },
    );
  },
  getAllDepartmetnDetail: (callback) => {
    pool.query(
      `
        SELECT 
        dep_id,
        dep_name,
        dep_status,
        create_date
    FROM department_master
      `,
      (error, results) => {
        if (error) {
          console.error("DB fetchAllAlumni error:", error);
          return callback(error, null);
        }
        return callback(null, results);
      },
    );
  },

  insertProgramDetail: (data, callback) => {
    const { program_name, program_alias, program_status } = data;

    pool.query(
      `
    INSERT INTO program_master
    (
      program_name,
      program_alias,
      program_status
    )
    VALUES (?, ?, ?)
    `,
      [program_name, program_alias, program_status],
      (error, result) => {
        if (error) {
          console.error("DB insertProgramDetail error:", error);
          return callback(error, null);
        }

        return callback(null, {
          program_id: result.insertId,
        });
      },
    );
  },

  // UPDATE PROGRAM
  updateProgramDetail: (data, callback) => {
    const { program_id, program_name, program_alias, program_status } = data;

    pool.query(
      `
    UPDATE program_master
    SET
      program_name = ?,
      program_alias = ?,
      program_status = ?,
      edit_date = NOW()
    WHERE program_id = ?
    `,
      [program_name, program_alias, program_status, program_id],
      (error, result) => {
        if (error) {
          console.error("DB updateProgramDetail error:", error);
          return callback(error, null);
        }

        if (result.affectedRows === 0) {
          return callback(null, {
            success: 0,
            message: "No record found",
          });
        }

        return callback(null, {
          program_id: program_id,
        });
      },
    );
  },

  // GET ALL PROGRAMS
  getAllProgramDetail: (callback) => {
    pool.query(
      `
    SELECT
      program_id,
      program_name,
      program_alias,
      program_status,
      create_date,
      edit_date
    FROM program_master
    `,
      (error, results) => {
        if (error) {
          console.error("DB getAllProgramDetail error:", error);
          return callback(error, null);
        }

        return callback(null, results);
      },
    );
  },
  // Insert
  insertDesignation: (data, callback) => {
    const { desg_name, desg_status } = data;

    pool.query(
      `INSERT INTO designation_master (desg_name, desg_status)
       VALUES (?, ?)`,
      [desg_name, desg_status],
      (err, result) => {
        if (err) {
          console.error("DB insertDesignation error:", err);
          return callback(err, null);
        }

        return callback(null, { desg_id: result.insertId });
      },
    );
  },

  // Fetch All
  getAllDesignation: (callback) => {
    pool.query(
      `SELECT 
          desg_id,
          desg_name,
          desg_status,
          create_date,
          edit_date
       FROM designation_master
       ORDER BY create_date DESC`,
      (err, results) => {
        if (err) {
          console.error("DB getAllDesignation error:", err);
          return callback(err, null);
        }
        return callback(null, results);
      },
    );
  },

  // Update
  updateDesignation: (data, callback) => {
    const { desg_id, desg_name, desg_status } = data;

    pool.query(
      `UPDATE designation_master
       SET desg_name = ?,
           desg_status = ?
       WHERE desg_id = ?`,
      [desg_name, desg_status, desg_id],
      (err, result) => {
        if (err) {
          console.error("DB updateDesignation error:", err);
          return callback(err, null);
        }

        return callback(null, { success: 1 });
      },
    );
  },
};
