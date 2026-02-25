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
      ORDER BY create_date DESC
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
    const { alumin_id } = data;
    pool.query(
      `
      UPDATE alumini
      SET 
        is_email_send = 1
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
};
