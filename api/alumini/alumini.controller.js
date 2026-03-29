const {
  insertChat,
  fetchAllActiveAlumini,
  createPost,
  getAllAluminiPost,
  InactiveAluminiPost,
  createEvent,
  getAllAluminiEventPost,
  fetchloggedAluminDetail,
  getFullAlumniProfile,
  insertSkill,
  updateSkill,
  getSkillsByAlumId,
  insertExperience,
  updateExperience,
  getExperienceByAlumId,
  insertEducation,
  updateEducation,
  getEducationByAlumId,
  insertProfile,
  updateProfile,
  getProfileByAlumId,
  updateAluminiBio,
  insertExperiencePromise,
  insertEducationPromise,
  getAllAluminiPostDetail,
  getAllAluminiEvents,
} = require("./alumini.service");

module.exports = {
  insertchatdetail: (req, res) => {
    try {
      const data = req.body;

      if (!data.query || !data.response) {
        return res.status(200).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      insertChat(data, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Chat saved successfully",
          data: result,
        });
      });
    } catch (error) {
      console.error("insertchatdetail error:", error);

      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  fetchAllActiveAlumini: (req, res) => {
    fetchAllActiveAlumini((err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Alumini Availbale", data: [] });
      return res.status(200).json({ success: 1, data: result });
    });
  },

  fetchloggedAluminDetail: (req, res) => {
    const { alum_id } = req.body;
    fetchloggedAluminDetail(alum_id, (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Alumini Availbale", data: [] });
      return res.status(200).json({ success: 1, data: result });
    });
  },

  createPost: (req, res) => {
    try {
      const {
        user_id,
        post_type,
        title,
        description,
        company,
        location,
        salary,
        event_date,
        alum_name,
      } = req.body;

      const file = req.file;

      //  Validation
      if (!user_id || !post_type || !description) {
        return res.status(400).json({
          success: 0,
          message: "Required fields missing",
        });
      }

      // Detect media type (image/video)
      const mediaType = file ? file.mimetype.split("/")[0] : null;
      const post_status = 1;

      // Step 1: Insert Post
      createPost(
        {
          user_id,
          post_type,
          title,
          description,
          company,
          location,
          salary,
          event_date,
          post_status,
        },
        (err, postId) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: 0,
              message: "DB Error",
            });
          }

          // Step 2: Emit socket event (optional)
          req.io.emit("new-post", {
            postId,
            user_id,
            post_type,
            title,
            description,
            alum_name,
            media_type: mediaType,
          });

          return res.status(200).json({
            success: 1,
            message: "Post created successfully",
            data: { postId },
          });
        },
      );
    } catch (error) {
      console.error("createPost error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  getAllAluminiPost: (req, res) => {
    const { alum_id } = req.body;
    getAllAluminiPost(alum_id, (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result?.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Post Available", data: [] });
      return res.status(200).json({ success: 1, data: result });
    });
  },




  getAllAluminiEventPost: (req, res) => {
    const { alum_id } = req.body;
    getAllAluminiEventPost(alum_id, (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result?.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Post Available", data: [] });
      return res.status(200).json({ success: 1, data: result });
    });
  },

  inactivePost: (req, res) => {
    const { id } = req.body;
    InactiveAluminiPost(id, (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result?.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Post Available", data: [] });
      return res
        .status(200)
        .json({ success: 1, message: "Deleted SuccessFully" });
    });
  },
  EventCreate: (req, res) => {
    try {
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
      } = req.body;

      const file = req.file;

      //  VALIDATION
      // ======================
      if (!user_id || !event_type || !title) {
        return res.status(400).json({
          success: 0,
          message: "Required fields missing",
        });
      }
      // detect file type (optional banner image)
      const mediaType = file ? file.mimetype.split("/")[0] : null;
      // STEP 1: INSERT EVENT
      // ======================
      createEvent(
        {
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
          status: status || "upcoming",
        },
        (err, eventId) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: 0,
              message: "DB Error",
            });
          }

          // optional socket emit
          req.io.emit("new-event", {
            eventId,
            user_id,
            event_type,
            title,
            media_type: mediaType,
          });

          return res.status(200).json({
            success: 1,
            message: "Event created successfully",
            eventId,
          });
        },
      );
    } catch (error) {
      console.error("EventCreate error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  /* =========================
     SKILLS
  ========================= */

  addSkill: (req, res) => {
    try {
      const { alum_id, skill_name } = req.body;

      if (!alum_id || !skill_name) {
        return res.status(400).json({
          success: 0,
          message: "Required fields missing",
        });
      }

      insertSkill({ alum_id, skill_name }, (err, insertId) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "DB Error",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Skill added successfully",
          insertId,
        });
      });
    } catch (error) {
      console.error("addSkill error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  editSkill: (req, res) => {
    try {
      const { id, skill_name } = req.body;

      if (!id || !skill_name) {
        return res.status(400).json({
          success: 0,
          message: "Required fields missing",
        });
      }

      updateSkill({ id, skill_name }, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "DB Error",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Skill updated successfully",
        });
      });
    } catch (error) {
      console.error("editSkill error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  getSkills: (req, res) => {
    try {
      const { alum_id } = req.params;

      getSkillsByAlumId(alum_id, (err, result) => {
        if (err) {
          return res.status(500).json({ success: 0, message: "DB Error" });
        }

        if (!result || result.length === 0) {
          return res.status(200).json({
            success: 2,
            message: "No Skills Found",
            data: [],
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      });
    } catch (error) {
      console.error("getSkills error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  /* =========================
     EXPERIENCE
  ========================= */

  // addExperience: (req, res) => {
  //   try {
  //     const { alum_id, experienceList } = req.body;

  //     console.log({
  //       experienceList,
  //     });

  //     if (!alum_id) {
  //       return res.status(400).json({
  //         success: 0,
  //         message: "Required fields missing",
  //       });
  //     }

  //     insertExperience(req.body, (err, insertId) => {
  //       if (err) {
  //         return res.status(500).json({ success: 0, message: "DB Error" });
  //       }

  //       return res.status(200).json({
  //         success: 1,
  //         message: "Experience added successfully",
  //         insertId,
  //       });
  //     });
  //   } catch (error) {
  //     console.error("addExperience error:", error);
  //     return res.status(500).json({
  //       success: 0,
  //       message: "Something went wrong",
  //     });
  //   }
  // },

  addExperience: async (req, res) => {
    try {
      const { alum_id, experienceList } = req.body;

      const promises = experienceList.map((exp) =>
        insertExperiencePromise({
          alum_id,
          ...exp,
        }),
      );
      const results = await Promise.all(promises);
      return res.json({
        success: 1,
        message: "All experiences added",
        data: results,
      });
    } catch (err) {
      return res.status(500).json({ success: 0 });
    }
  },

  editExperience: (req, res) => {
    const data = req.body;

    console.log({
      data,
    });

    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: 0,
          message: "ID required",
        });
      }

      updateExperience(data, (err, result) => {
        console.log({
          err,
        });

        if (err) {
          return res.status(500).json({ success: 0, message: "DB Error" });
        }

        return res.status(200).json({
          success: 1,
          message: "Experience updated successfully",
        });
      });
    } catch (error) {
      console.error("editExperience error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  getExperience: (req, res) => {
    try {
      const { alum_id } = req.params;

      getExperienceByAlumId(alum_id, (err, result) => {
        if (err) return res.status(500).json({ success: 0 });

        if (!result || result.length === 0) {
          return res.status(200).json({
            success: 2,
            message: "No Experience Found",
            data: [],
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      });
    } catch (error) {
      console.error("getExperience error:", error);
      res.status(500).json({ success: 0 });
    }
  },

  /* =========================
     EDUCATION
  ========================= */

  addEducation: async (req, res) => {
    try {
      const { alum_id, educationList } = req.body;

      if (!alum_id || !educationList?.length) {
        return res.status(400).json({
          success: 0,
          message: "Required fields missing",
        });
      }

      const promises = educationList.map((edu) =>
        insertEducationPromise({
          alum_id,
          ...edu,
        }),
      );

      const results = await Promise.all(promises);

      return res.status(200).json({
        success: 1,
        message: "All education added successfully",
        data: results,
      });
    } catch (error) {
      console.error("addEducation error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  editEducation: (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: 0,
          message: "ID required",
        });
      }

      updateEducation(req.body, (err, result) => {
        if (err) return res.status(500).json({ success: 0 });

        return res.status(200).json({
          success: 1,
          message: "Education updated successfully",
        });
      });
    } catch (error) {
      console.error("editEducation error:", error);
      res.status(500).json({ success: 0 });
    }
  },

  getEducation: (req, res) => {
    try {
      const { alum_id } = req.params;

      getEducationByAlumId(alum_id, (err, result) => {
        if (err) return res.status(500).json({ success: 0 });

        if (!result || result.length === 0) {
          return res.status(200).json({
            success: 2,
            message: "No Education Found",
            data: [],
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      });
    } catch (error) {
      console.error("getEducation error:", error);
      res.status(500).json({ success: 0 });
    }
  },

  /* =========================
     PROFILE
  ========================= */

  addProfile: (req, res) => {
    try {
      const { alum_id } = req.body;

      if (!alum_id) {
        return res.status(400).json({
          success: 0,
          message: "Alum ID required",
        });
      }

      insertProfile(req.body, (err, insertId) => {
        if (err) return res.status(500).json({ success: 0 });

        return res.status(200).json({
          success: 1,
          message: "Profile created successfully",
          insertId,
        });
      });
    } catch (error) {
      console.error("addProfile error:", error);
      res.status(500).json({ success: 0 });
    }
  },

  updateAluminiBio: (req, res) => {
    const data = req.body;
    try {
      const { alum_id } = data;

      if (!alum_id) {
        return res.status(400).json({
          success: 0,
          message: "Alum ID required",
        });
      }

      updateAluminiBio(data, (err, insertId) => {
        if (err) return res.status(500).json({ success: 0 });

        return res.status(200).json({
          success: 1,
          message: "Profile Bio Updated successfully",
          insertId,
        });
      });
    } catch (error) {
      console.error("addProfile error:", error);
      res.status(500).json({ success: 0 });
    }
  },

  editProfile: (req, res) => {
    const data = req.body;
    try {
      const { alum_id } = req.body;

      if (!alum_id) {
        return res.status(400).json({
          success: 0,
          message: "Alum ID required",
        });
      }

      updateProfile(data, (err, result) => {
        if (err) return res.status(500).json({ success: 0 });

        return res.status(200).json({
          success: 1,
          message: "Profile updated successfully",
        });
      });
    } catch (error) {
      console.error("editProfile error:", error);
      res.status(500).json({ success: 0 });
    }
  },

  getProfileDetail: (req, res) => {
    try {
      const { alum_id } = req.params;

      getProfileByAlumId(alum_id, (err, result) => {
        if (err) return res.status(500).json({ success: 0 });

        if (!result || result.length === 0) {
          return res.status(200).json({
            success: 2,
            message: "No Profile Found",
            data: [],
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      });
    } catch (error) {
      console.error("getProfileDetail error:", error);
      res.status(500).json({ success: 0 });
    }
  },

  /* =========================
     FULL PROFILE
  ========================= */

  getFullProfile: (req, res) => {
    try {
      const { alum_id } = req.params;

      getFullAlumniProfile(alum_id, (err, result) => {
        if (err) return res.status(500).json({ success: 0 });

        if (!result || result.length === 0) {
          return res.status(200).json({
            success: 2,
            message: "No Data Found",
            data: [],
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      });
    } catch (error) {
      console.error("getFullProfile error:", error);
      res.status(500).json({ success: 0 });
    }
  },


    getAllAluminiPostDetail: (req, res) => {
    getAllAluminiPostDetail((err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result?.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Post Available", data: [] });
      return res.status(200).json({ success: 1, data: result });
    });
  },
    getAllAluminiEvents: (req, res) => {
    getAllAluminiEvents( (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result?.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Post Available", data: [] });
      return res.status(200).json({ success: 1, data: result });
    });
  },
};


