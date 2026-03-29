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
  insertProgramYear: (data, callback) => {
    const { program_year_name, program_id } = data;

    pool.query(
      `
    INSERT INTO program_master_detail
    (
      program_year_name,
      program_id
    )
    VALUES (?, ?)
    `,
      [program_year_name, program_id],
      (error, result) => {
        if (error) {
          console.error("DB insertProgramYear error:", error);
          return callback(error, null);
        }

        return callback(null, {
          prgm_mast_dtl_slno: result.insertId,
        });
      },
    );
  },
  updateProgramYear: (data, callback) => {
    const { prgm_mast_dtl_slno, program_year_name, program_id } = data;

    pool.query(
      `
    UPDATE program_master_detail
    SET
      program_year_name = ?,
      program_id = ?,
      edit_date = NOW()
    WHERE prgm_mast_dtl_slno = ?
    `,
      [program_year_name, program_id, prgm_mast_dtl_slno],
      (error, result) => {
        if (error) {
          console.error("DB updateProgramYear error:", error);
          return callback(error, null);
        }

        if (result.affectedRows === 0) {
          return callback(null, {
            success: 0,
            message: "No record found",
          });
        }

        return callback(null, {
          prgm_mast_dtl_slno: prgm_mast_dtl_slno,
        });
      },
    );
  },
  getAllProgramYear: (callback) => {
    pool.query(
      `
    SELECT
      d.prgm_mast_dtl_slno,
      d.program_year_name,
      d.program_id,
      p.program_name,
      d.create_date,
      d.edit_date
    FROM program_master_detail d
    LEFT JOIN program_master p
    ON p.program_id = d.program_id
    ORDER BY d.prgm_mast_dtl_slno DESC
    `,
      (error, results) => {
        if (error) {
          console.error("DB getAllProgramYear error:", error);
          return callback(error, null);
        }

        return callback(null, results);
      },
    );
  },
  getProgramMasterYearById: (id, callback) => {
    pool.query(
      `
    SELECT
      d.prgm_mast_dtl_slno,
      d.program_year_name,
      d.program_id,
      p.program_name,
      d.create_date,
      d.edit_date
    FROM program_master_detail d
    LEFT JOIN program_master p
    ON p.program_id = d.program_id
    where d.program_id = ?
    `,
      [id],
      (error, results) => {
        if (error) {
          console.error("DB getAllProgramYear error:", error);
          return callback(error, null);
        }

        return callback(null, results);
      },
    );
  },

  getAdminAlert: (callback) => {
    pool.query(
      `
    SELECT *
      FROM alerts
      where is_active = 1
      ORDER BY created_at DESC
    `,
      [],
      (error, results) => {
        if (error) {
          console.error("DB getAllProgramYear error:", error);
          return callback(error, null);
        }
        return callback(null, results);
      },
    );
  },

  deleteAlerts: (id, callback) => {
    pool.query(
      `UPDATE alerts SET is_active = 0 WHERE id=?`,
      [id],
      (error, results) => {
        if (error) {
          console.error("DB getAllProgramYear error:", error);
          return callback(error, null);
        }
        return callback(null, results);
      },
    );
  },

  findAdminByUserName: (data, callback) => {
    const { username, password } = data;
    pool.query(
      "SELECT * FROM admin_users WHERE username = ? and password =?",
      [username, password],
      (err, rows) => {
        if (err) {
          console.error("findUserByEmail DB error:", err);
          return callback(err, null);
        }

        // return first row or undefined
        return callback(null, rows[0]);
      },
    );
  },

  insertAlert: (data, callback) => {
    const { title, message } = data;

    pool.query(
      `
    INSERT INTO alerts
    (
      title,
      message
    )
    VALUES (?, ?)
    `,
      [title, message],
      (error, result) => {
        if (error) {
          console.error("DB insertAlert error:", error);
          return callback(error, null);
        }

        return callback(null, {
          alert_id: result.insertId,
        });
      },
    );
  },

  insertGroupDetail: (data, callback) => {
    const { group_name, group_alias, group_status } = data;

    pool.query(
      `
    INSERT INTO user_group_master
    (
      group_name,
      group_alias,
      group_status
    )
    VALUES (?, ?, ?)
    `,
      [group_name, group_alias, group_status],
      (error, result) => {
        if (error) {
          console.error("DB insertGroupDetail error:", error);
          return callback(error, null);
        }

        return callback(null, {
          group_id: result.insertId,
        });
      },
    );
  },
  updateGroupDetail: (data, callback) => {
    const { group_id, group_name, group_alias, group_status } = data;

    pool.query(
      `
    UPDATE user_group_master
    SET
      group_name = ?,
      group_alias = ?,
      group_status = ?,
      edit_date = NOW()
    WHERE group_id = ?
    `,
      [group_name, group_alias, group_status, group_id],
      (error, result) => {
        if (error) {
          console.error("DB updateGroupDetail error:", error);
          return callback(error, null);
        }

        if (result.affectedRows === 0) {
          return callback(null, {
            success: 0,
            message: "No record found",
          });
        }

        return callback(null, {
          group_id: group_id,
        });
      },
    );
  },
  getAllGroupDetail: (callback) => {
    pool.query(
      `
    SELECT
      group_id,
      group_name,
      group_alias,
      group_status,
      create_date,
      edit_date
    FROM user_group_master
    ORDER BY group_id DESC
    `,
      (error, results) => {
        if (error) {
          console.error("DB getAllGroupDetail error:", error);
          return callback(error, null);
        }

        return callback(null, results);
      },
    );
  },
  insertFaculty: (faculty, callback) => {
    const {
      fac_name,
      fac_dep_id,
      fac_age,
      fac_group,
      fac_desg_id,
      fac_mobile_no,
      fac_address,
      fac_email,
      fac_status,
    } = faculty;

    pool.query(
      `
    INSERT INTO faculity (
      fac_name,
      fac_dep_id,
      fac_age,
      fac_group,
      fac_desg_id,
      fac_mobile_no,
      fac_address,
      fac_email,
      fac_stauts
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        fac_name,
        fac_dep_id,
        fac_age,
        fac_group,
        fac_desg_id,
        fac_mobile_no,
        fac_address,
        fac_email,
        fac_status,
      ],
      (error, result) => {
        if (error) {
          console.error("DB insertFaculty error:", error);
          return callback(error, null);
        }

        return callback(null, {
          fac_id: result.insertId,
        });
      },
    );
  },
  InsertFacultyLogin: (loginData, callback) => {
    const { fac_username, fac_password, fac_active_status, fac_id } = loginData;
    console.log({
      fac_id,
    });

    pool.query(
      `INSERT INTO fac_login_master (
      fac_id,
      fac_username,
      fac_password,
      fac_active_status
    )
    VALUES (?, ?, ?, ?)`,
      [fac_id, fac_username, fac_password, fac_active_status],
      (error, result) => {
        if (error) {
          console.error("DB InsertFacultyLogin error:", error);
          return callback(error, null);
        }
        return callback(null, {
          fac_login_id: result.insertId,
        });
      },
    );
  },
  getAllFaculity: (callback) => {
    pool.query(
      `
      SELECT 
    fac_id,
    fac_name,
    fac_age,
    fac_mobile_no,
    fac_address,
    fac_stauts,
    fac_email,
    fac_admin_verify,
    dm.dep_name,
    dgm.desg_name,
    ugm.group_name
FROM
    faculity fl
left join department_master dm on dm.dep_id = fl.fac_dep_id
left join designation_master dgm on dgm.desg_id = fl.fac_desg_id
left join user_group_master ugm on ugm.group_id = fl.fac_group
       
      `,
      [],
      (error, results) => {
        if (error) {
          console.error("DB fetchAllAlumni error:", error);
          return callback(error, null);
        }
        return callback(null, results);
      },
    );
  },
  ApproveFaculity: (callback) => {
    pool.query(
      `
update faculity 
set 
fac_admin_verify = 1,
fac_stauts = 1
where 
fac_id = ?
      `,
      [data.fac_id],
      (error, results) => {
        if (error) {
          console.error("DB fetchAllAlumni error:", error);
          return callback(error, null);
        }
        return callback(null, results);
      },
    );
  },
  ApproveFaculity: (data, callback) => {
    pool.query(
      `
update faculity 
set 
fac_admin_verify = 1,
fac_stauts = 1
where 
fac_id = ?
      `,
      [data.fac_id],
      (error, results) => {
        if (error) {
          console.error("DB fetchAllAlumni error:", error);
          return callback(error, null);
        }
        return callback(null, results);
      },
    );
  },
  ApproveFacLoginDtl: (data, callback) => {
    pool.query(
      `
      update faculity 
      set 
      fac_stauts = ?
      where  fac_id = ?
      `,
      [data.fac_active_status, data.fac_id],
      (error, results) => {
        if (error) {
          console.error("DB fetchAllAlumni error:", error);
          return callback(error, null);
        }
        return callback(null, results);
      },
    );
  },
};
