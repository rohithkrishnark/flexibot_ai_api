const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // Insert Chat
  insertChat: (data, callback) => {
    const { user_id, query, response } = data;

    const sql =
      "INSERT INTO chatbot_messages (user_id, query, response) VALUES (?, ?, ?)";

    pool.query(sql, [user_id || null, query, response], (err, result) => {
      if (err) {
        return callback(err);
      }

      return callback(null, result);
    });
  },
  fetchAllActiveAlumini: (callback) => {
    pool.query(
      `SELECT 
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
      FROM
          alumini
      where alum_status = 1 and is_email_send = 1 `,
      [],
      (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows);
      },
    );
  },

  fetchloggedAluminDetail: (alum_id, callback) => {
    pool.query(
      `SELECT 
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
          is_email_send,
          bio,
          followers_count
      FROM
          alumini
      where alum_status = 1 and is_email_send = 1 and alum_id = ? `,
      [alum_id],
      (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows);
      },
    );
  },

  createPost: (data, callback) => {
    const {
      user_id,
      post_type,
      title,
      description,
      company,
      location,
      salary,
      event_date,
      post_status,
    } = data;

    pool.query(
      `INSERT INTO posts 
    (user_id, post_type, title, description, company, location, salary, event_date,post_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        user_id,
        post_type,
        title,
        description,
        company,
        location,
        salary,
        event_date,
        post_status,
      ],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result.insertId);
      },
    );
  },

  getAllAluminiPost: (alum_id, callback) => {
    pool.query(
      `SELECT 
          id,
          user_id,
          post_type,
          title,
          description,
          company,
          location,
          salary,
          event_date,
          created_at
      FROM
          posts
      WHERE
          user_id = ? and post_status = 1
    `,
      [alum_id],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      },
    );
  },

  getAllAluminiEventPost: (alum_id, callback) => {
    pool.query(
      `
      SELECT
        id,
        user_id,
        event_type,
        title,
        description,
        company,
        event_date,
        start_time, 
        end_time,
        location,
        registration_link, 
        banner_image, 
        status,
        created_at
      FROM
          alumni_events
      WHERE user_id = ?
    `,
      [alum_id],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      },
    );
  },

  InactiveAluminiPost: (id, callback) => {
    pool.query(
      `UPDATE 
          posts
      SET post_status = 0
      WHERE id = ? 
    `,
      [id],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      },
    );
  },

  createEvent: (data, callback) => {
    const {
      user_id,
      event_type,
      title,
      description,
      company,
      event_date,
      start_time,
      end_time,
      location,
      registration_link,
      status,
    } = data;

    pool.query(
      `INSERT INTO alumni_events 
    (user_id, event_type, title, description, company, event_date, start_time, end_time, location, registration_link, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        event_type,
        title,
        description,
        company,
        event_date,
        start_time,
        end_time,
        location,
        registration_link,
        status,
      ],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result.insertId);
      },
    );
  },

  /* =========================
     SKILLS
  ========================= */

  insertSkill: (data, callback) => {
    const { alum_id, skill_name } = data;

    pool.query(
      `INSERT INTO alumni_skills (alum_id, skill_name) VALUES (?, ?)`,
      [alum_id, skill_name],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result.insertId);
      },
    );
  },

  updateSkill: (data, callback) => {
    const { id, skill_name } = data;

    pool.query(
      `UPDATE alumni_skills SET skill_name=? WHERE id=?`,
      [skill_name, id],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      },
    );
  },

  getSkillsByAlumId: (alum_id, callback) => {
    pool.query(
      `SELECT * FROM alumni_skills WHERE alum_id=?`,
      [alum_id],
      (err, rows) => {
        if (err) return callback(err);
        return callback(null, rows);
      },
    );
  },

  /* =========================
     EXPERIENCE
  ========================= */

  // insertExperience: (data, callback) => {
  //   const {
  //     alum_id,
  //     company,
  //     designation,
  //     location,
  //     start_date,
  //     end_date,
  //     is_current,
  //     description,
  //   } = data;

  //   pool.query(
  //     `INSERT INTO alumni_experience
  //     (alum_id, company, designation, location, start_date, end_date, is_current, description)
  //     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  //     [
  //       alum_id,
  //       company,
  //       designation,
  //       location,
  //       start_date,
  //       end_date,
  //       is_current,
  //       description,
  //     ],
  //     (err, result) => {
  //       if (err) return callback(err);
  //       return callback(null, result.insertId);
  //     },
  //   );
  // },

  insertExperiencePromise: (data) => {
    return new Promise((resolve, reject) => {
      const {
        alum_id,
        company,
        designation,
        location,
        start_date,
        end_date,
        is_current,
        description,
      } = data;

      pool.query(
        `INSERT INTO alumni_experience
      (alum_id, company, designation, location, start_date, end_date, is_current, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          alum_id,
          company,
          designation,
          location,
          start_date,
          end_date,
          is_current,
          description,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        },
      );
    });
  },

  updateExperience: (data, callback) => {
    const {
      id,
      company,
      designation,
      location,
      start_date,
      end_date,
      is_current,
      description,
    } = data;

    pool.query(
      `UPDATE alumni_experience
       SET company=?, designation=?, location=?, start_date=?, end_date=?, is_current=?, description=?
       WHERE id=?`,
      [
        company,
        designation,
        location,
        start_date,
        end_date,
        is_current,
        description,
        id,
      ],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      },
    );
  },

  getExperienceByAlumId: (alum_id, callback) => {
    pool.query(
      `SELECT * FROM alumni_experience WHERE alum_id=?`,
      [alum_id],
      (err, rows) => {
        if (err) return callback(err);
        return callback(null, rows);
      },
    );
  },

  /* =========================
     EDUCATION
  ========================= */

  // insertEducation: (data, callback) => {
  //   const {
  //     alum_id,
  //     degree,
  //     institution,
  //     field_of_study,
  //     start_year,
  //     end_year,
  //     description,
  //   } = data;

  //   pool.query(
  //     `INSERT INTO alumni_education
  //     (alum_id, degree, institution, field_of_study, start_year, end_year, description)
  //     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  //     [
  //       alum_id,
  //       degree,
  //       institution,
  //       field_of_study,
  //       start_year,
  //       end_year,
  //       description,
  //     ],
  //     (err, result) => {
  //       if (err) return callback(err);
  //       return callback(null, result.insertId);
  //     },
  //   );
  // },

  insertEducationPromise: (data) => {
    return new Promise((resolve, reject) => {
      const {
        alum_id,
        degree,
        institution,
        field_of_study,
        start_year,
        end_year,
        description,
      } = data;

      pool.query(
        `INSERT INTO alumni_education
      (alum_id, degree, institution, field_of_study, start_year, end_year, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          alum_id,
          degree,
          institution,
          field_of_study,
          start_year,
          end_year,
          description,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        },
      );
    });
  },

  updateEducation: (data, callback) => {
    const {
      id,
      degree,
      institution,
      field_of_study,
      start_year,
      end_year,
      description,
    } = data;

    pool.query(
      `UPDATE alumni_education
       SET degree=?, institution=?, field_of_study=?, start_year=?, end_year=?, description=?
       WHERE id=?`,
      [
        degree,
        institution,
        field_of_study,
        start_year,
        end_year,
        description,
        id,
      ],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      },
    );
  },

  getEducationByAlumId: (alum_id, callback) => {
    pool.query(
      `SELECT * FROM alumni_education WHERE alum_id=?`,
      [alum_id],
      (err, rows) => {
        if (err) return callback(err);
        return callback(null, rows);
      },
    );
  },

  /* =========================
     PROFILE
  ========================= */

  insertProfile: (data, callback) => {
    const { alum_id, bio, headline, location } = data;

    pool.query(
      `INSERT INTO alumni_profile (alum_id, bio, headline, location)
       VALUES (?, ?, ?, ?)`,
      [alum_id, bio, headline, location],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result.insertId);
      },
    );
  },
  updateAluminiBio: (data, callback) => {
    const { alum_id, bio } = data;
    pool.query(
      `UPDATE  alumini set bio = ? where alum_id = ?`,
      [bio, alum_id],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result.insertId);
      },
    );
  },

  updateProfile: (data, callback) => {
    const { alum_id, bio, headline, location } = data;

    pool.query(
      `UPDATE alumni_profile
       SET bio=?, headline=?, location=?
       WHERE alum_id=?`,
      [bio, headline, location, alum_id],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      },
    );
  },

  getProfileByAlumId: (alum_id, callback) => {
    pool.query(
      `SELECT * FROM alumni_profile WHERE alum_id=?`,
      [alum_id],
      (err, rows) => {
        if (err) return callback(err);
        return callback(null, rows);
      },
    );
  },

  /* =========================
     FULL PROFILE
  ========================= */

  getFullAlumniProfile: (alum_id, callback) => {
    pool.query(
      `SELECT 
        a.alum_id,
        a.alum_name,
        p.bio,
        p.headline,
        p.location
       FROM alumini a
       LEFT JOIN alumni_profile p ON a.alum_id = p.alum_id
       WHERE a.alum_id = ?`,
      [alum_id],
      (err, rows) => {
        if (err) return callback(err);
        return callback(null, rows);
      },
    );
  },
};
