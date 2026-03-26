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
        std_status,
        std_password
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
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
        student.std_password,
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
  fetchAllStudents: (data, callback) => {
    pool.query(
      `
  SELECT
        s.*,
        pm.program_name,
        py.program_year_name,
        dm.dep_name
      FROM student s
      LEFT JOIN program_master pm
      ON pm.program_id = s.std_program_id
      LEFT JOIN program_master_detail py
      ON py.prgm_mast_dtl_slno = s.std_program_year
       LEFT JOIN department_master dm
		on dm.dep_id = s.std_dep_id
    where std_dep_id = ?
      `,
      [data.dep_id],
      (err, rows) => {
        if (err) {
          console.error("fetchAllStudents DB error:", err);
          return callback(err, null);
        }

        return callback(null, rows);
      },
    );
  },

  getLoggedStudentDetail: (data, callback) => {
    pool.query(
      `
  SELECT
        s.*,
        pm.program_name,
        py.program_year_name,
        dm.dep_name
      FROM student s
      LEFT JOIN program_master pm
      ON pm.program_id = s.std_program_id
      LEFT JOIN program_master_detail py
      ON py.prgm_mast_dtl_slno = s.std_program_year
       LEFT JOIN department_master dm
		on dm.dep_id = s.std_dep_id
    where std_id = ?
      `,
      [data.std_id],
      (err, rows) => {
        if (err) {
          console.error("fetchAllStudents DB error:", err);
          return callback(err, null);
        }

        return callback(null, rows);
      },
    );
  },

  inactiveStudent: (data, callback) => {
    pool.query(
      `UPDATE student SET std_status = ? WHERE std_id = ?`,
      [data.std_status, data.std_id],
      (err, result) => {
        if (err) return callback(err);

        return callback(null, result.affectedRows);
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
        std_status = ?
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
  batchStudentDetail: (data, callback) => {
    pool.query(
      `
  SELECT
        s.*,
        pm.program_name,
        py.program_year_name,
        dm.dep_name
      FROM student s
      LEFT JOIN program_master pm
      ON pm.program_id = s.std_program_id
      LEFT JOIN program_master_detail py
      ON py.prgm_mast_dtl_slno = s.std_program_year
       LEFT JOIN department_master dm
		on dm.dep_id = s.std_dep_id
    where std_dep_id = ? and std_program_id=? and std_program_year= ? and std_status = 1
      `,
      [data.dep_id, data.std_program_id, data.std_program_year],
      (err, rows) => {
        if (err) {
          console.error("fetchAllStudents DB error:", err);
          return callback(err, null);
        }

        return callback(null, rows);
      },
    );
  },
  findStudentByEmail: (email, callback) => {
    pool.query(
      "SELECT * FROM student WHERE std_email = ?",
      [email],
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
  createPost: (postData, callback) => {
    const { caption, description, std_id, media_type } = postData;
    pool.query(
      `INSERT INTO student_posts
      (caption, description, media_type, std_id)
      VALUES (?, ?, ?, ?)`,
      [caption, description, media_type, std_id],
      (err, result) => {
        if (err) {
          console.error("createPost DB error:", err);
          return callback(err, null);
        }
        callback(null, result.insertId); // return insertId
      },
    );
  },
  createActivity: (activityData, callback) => {
    const { caption, description, student_id } = activityData;
    pool.query(
      `INSERT INTO student_activities (caption, description, student_id) VALUES (?, ?, ?)`,
      [caption, description, student_id],
      (err, result) => {
        if (err) {
          console.error("createActivity DB error:", err);
          return callback(err, null);
        }
        callback(null, result.insertId); // return activity ID
      },
    );
  },

  createConnection: (data, callback) => {
    const { sender_id, sender_type, receiver_id, receiver_type } = data;
    pool.query(
      `INSERT INTO connections 
    (sender_id, sender_type, receiver_id, receiver_type)
    VALUES (?, ?, ?, ?)`,
      [sender_id, sender_type, receiver_id, receiver_type],
      (err, result) => {
        if (err) {
          console.error("createActivity DB error:", err);
          return callback(err, null);
        }
        callback(null, result.insertId); // return activity ID
      },
    );
  },

  getAllPosts: (std_id, callback) => {
    pool.query(
      `SELECT * FROM student_posts where std_id=? ORDER BY created_at DESC `,
      [std_id],
      (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows);
      },
    );
  },

  getAllActivityDetail: (std_id, callback) => {
    pool.query(
      `SELECT * FROM student_activities where student_id=? ORDER BY created_at DESC `,
      [std_id],
      (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows);
      },
    );
  },

  fetchPostById: (id, callback) => {
    const query = `SELECT * FROM student_posts WHERE id = ?`;
    pool.query(query, [id], (err, rows) => {
      if (err) {
        console.error("fetchPostById DB error:", err);
        return callback(err, null);
      }
      return callback(null, rows[0]);
    });
  },

  deletePost: (id, callback) => {
    const query = `DELETE FROM student_posts WHERE id = ?`;
    pool.query(query, [id], (err, result) => {
      if (err) {
        console.error("deletePost DB error:", err);
        return callback(err, null);
      }
      return callback(null, result.affectedRows);
    });
  },
  increaseFollower: (id, type) => {
    console.log({ id, type });

    let table = "";
    let column = "";

    if (type === "student") {
      table = "students";
      column = "std_id";
    } else if (type === "alumni") {
      table = "alumini";
      column = "alum_id";
    } else if (type === "faculty") {
      table = "faculty";
      column = "faculty_id";
    } else {
      console.log("Invalid type");
      return;
    }

    pool.query(
      `UPDATE ${table} 
     SET followers_count = COALESCE(followers_count, 0) + 1 
     WHERE ${column} = ?`,
      [id],
      (err, result) => {
        if (err) {
          console.error("increaseFollower error:", err);
        } else {
          console.log("Follower updated:", result.affectedRows);
        }
      },
    );
  },

  getMyConnections: (user_id, user_type, callback) => {
    pool.query(
      `
    SELECT 
      c.receiver_id,
      c.receiver_type,

      -- Alumni
      a.alum_name,
      a.alum_company,
      a.alum_company_designation,
      a.alum_email,

      -- Student (optional)
      s.std_name


    FROM connections c
    LEFT JOIN alumini a 
      ON c.receiver_id = a.alum_id 
      AND c.receiver_type = 'alumni'

    LEFT JOIN student s 
      ON c.receiver_id = s.std_id 
      AND c.receiver_type = 'student'

    WHERE c.sender_id = ? AND c.sender_type = ?
    `,
      [user_id, user_type],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      },
    );
  },

  EditStudentBio: (data, callback) => {
    pool.query(
      `UPDATE student
     SET bio = ?
     WHERE std_id = ?`,
      [data.bio, data.std_id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      },
    );
  },
  EditSkillService: (data, callback) => {
    pool.query(
      `UPDATE student
     SET skill = ?
     WHERE std_id = ?`,
      [data.skill, data.std_id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      },
    );
  },
};
