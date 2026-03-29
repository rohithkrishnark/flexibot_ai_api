const fs = require("fs");
const path = require("path");
const POST_UPLOAD_DIR = "C:/uploads/alumini-posts";
const EVENT_UPLOAD_DIR = "C:/uploads/alumini-events";
const ALUMINI_PROFILE_UPLOAD_DIR = "C:/uploads/alumini-profiles";

/**
 * UPLOAD POST MEDIA (IMAGE/VIDEO)
 */

const uploadAluminiPostMedia = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: 0,
        message: "No file uploaded",
      });
    }

    const mediaType = req.file.mimetype.split("/")[0]; // image / video
    const { postId, user_id } = req.body;

    if (!postId || !user_id) {
      return res.status(400).json({
        success: 0,
        message: "postId and user_id required",
      });
    }

    //  Decide folder based on media type
    const mediaFolder = mediaType === "image" ? "photos" : "videos";

    //  Folder: alumini-post/user_id/postId/photos OR videos
    const finalDir = path.join(
      POST_UPLOAD_DIR,
      String(user_id),
      String(postId),
      mediaFolder,
    );

    //  Create folder if not exists
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    //  Unique filename
    const uniqueName = `${Date.now()}_${req.file.originalname}`;
    const destPath = path.join(finalDir, uniqueName);

    //  Move file
    fs.renameSync(req.file.path, destPath);

    const fileInfo = {
      filename: uniqueName,
      originalName: req.file.originalname,
      type: mediaType,
      path: destPath.replace(/\\/g, "/"),
    };

    return res.status(200).json({
      success: 1,
      message: "Media uploaded successfully",
      data: fileInfo,
    });
  } catch (error) {
    console.error("upload error:", error);
    return res.status(500).json({
      success: 0,
      message: "Something went wrong",
    });
  }
};

const uploadAluminiEventMedia = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: 0,
        message: "No file uploaded",
      });
    }

    const mediaType = req.file.mimetype.split("/")[0]; // image / video
    const { eventId, user_id } = req.body;

    if (!eventId || !user_id) {
      return res.status(400).json({
        success: 0,
        message: "eventId and user_id required",
      });
    }

    // =========================
    // Decide folder structure
    // =========================
    const mediaFolder = mediaType === "image" ? "photos" : "videos";

    // C:/uploads/alumini-events/user_id/eventId/photos
    const finalDir = path.join(
      EVENT_UPLOAD_DIR,
      String(user_id),
      String(eventId),
      mediaFolder,
    );

    // =========================
    // Create folder if not exists
    // =========================
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    // =========================
    // Save file
    // =========================
    const uniqueName = `${Date.now()}_${req.file.originalname}`;
    const destPath = path.join(finalDir, uniqueName);

    fs.renameSync(req.file.path, destPath);

    const fileInfo = {
      filename: uniqueName,
      originalName: req.file.originalname,
      type: mediaType,
      path: destPath.replace(/\\/g, "/"),
    };

    return res.status(200).json({
      success: 1,
      message: "Event media uploaded successfully",
      data: fileInfo,
    });
  } catch (error) {
    console.error("event upload error:", error);
    return res.status(500).json({
      success: 0,
      message: "Something went wrong",
    });
  }
};

const uploadAluminiProfilePicture = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }

  const mediaType = req.file.mimetype.split("/")[0];

  if (mediaType !== "image") {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res
      .status(400)
      .json({ success: 0, message: "Only image uploads are allowed" });
  }

  const { alum_id } = req.body;

  if (!alum_id) {
    return res.status(400).json({ success: 0, message: "Student ID required" });
  }

  // /uploads/profile/<student_id>/profilephoto/
  const studentDir = path.join(ALUMINI_PROFILE_UPLOAD_DIR, String(alum_id));
  const profileDir = path.join(studentDir, "profilephoto");

  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
  }

  // OPTIONAL: delete old profile photo (keep only one)
  fs.readdirSync(profileDir).forEach((file) => {
    fs.unlinkSync(path.join(profileDir, file));
  });

  const destPath = path.join(profileDir, req.file.filename);
  fs.renameSync(req.file.path, destPath);

  return res.status(200).json({
    success: 1,
    message: "Profile uploaded successfully",
    data: {
      filename: req.file.filename,
      path: `/uploads/alumini-profiles/${alum_id}/profilephoto/${req.file.filename}`,
    },
  });
};
/**
 * GET MEDIA FILES FOR A POST
 */

const getAllAlumniniPostDetail = (req, res) => {
  const { AlumId } = req.params;

  if (!AlumId) {
    return res.status(400).json({
      success: 0,
      message: "Alumni ID required",
    });
  }

  const baseDir = path.join(POST_UPLOAD_DIR, String(AlumId));

  if (!fs.existsSync(baseDir)) {
    return res.status(200).json({
      success: 2,
      message: "No posts found",
      data: [],
    });
  }

  const postIds = fs.readdirSync(baseDir);
  let allPosts = [];

  postIds.forEach((postId) => {
    const postDir = path.join(baseDir, postId);

    const photosDir = path.join(postDir, "photos");
    const videosDir = path.join(postDir, "videos");

    let mediaFiles = [];

    // 📸 Photos
    if (fs.existsSync(photosDir)) {
      const photos = fs.readdirSync(photosDir).map((file, index) => ({
        id: index + 1,
        filename: file,
        type: "image",
        url: `/uploads/alumini-posts/${AlumId}/${postId}/photos/${file}`,
      }));
      mediaFiles = mediaFiles.concat(photos);
    }

    // 🎥 Videos
    if (fs.existsSync(videosDir)) {
      const videos = fs.readdirSync(videosDir).map((file, index) => ({
        id: mediaFiles.length + index + 1,
        filename: file,
        type: "video",
        url: `/uploads/alumini/${AlumId}/${postId}/videos/${file}`,
      }));
      mediaFiles = mediaFiles.concat(videos);
    }

    allPosts.push({
      postId,
      media: mediaFiles,
    });
  });

  return res.status(200).json({
    success: 1,
    message: "Posts fetched successfully",
    data: allPosts,
  });
};




const getFullpostMediaDetail = (req, res) => {
  const baseDir = path.join(POST_UPLOAD_DIR);

  if (!fs.existsSync(baseDir)) {
    return res.status(200).json({
      success: 2,
      message: "No posts found",
      data: [],
    });
  }

  const alumIds = fs.readdirSync(baseDir);
  let allPosts = [];

  alumIds.forEach((alumId) => {
    const alumDir = path.join(baseDir, alumId);

    if (!fs.lstatSync(alumDir).isDirectory()) return;

    const postIds = fs.readdirSync(alumDir);

    postIds.forEach((postId) => {
      const postDir = path.join(alumDir, postId);

      if (!fs.lstatSync(postDir).isDirectory()) return;

      const photosDir = path.join(postDir, "photos");
      const videosDir = path.join(postDir, "videos");

      let mediaFiles = [];

      // 📸 Photos
      if (fs.existsSync(photosDir)) {
        const photos = fs.readdirSync(photosDir).map((file, index) => ({
          id: index + 1,
          filename: file,
          type: "image",
          url: `/uploads/alumini-posts/${alumId}/${postId}/photos/${file}`,
        }));
        mediaFiles.push(...photos);
      }

      // 🎥 Videos
      if (fs.existsSync(videosDir)) {
        const videos = fs.readdirSync(videosDir).map((file, index) => ({
          id: mediaFiles.length + index + 1,
          filename: file,
          type: "video",
          url: `/uploads/alumini-posts/${alumId}/${postId}/videos/${file}`,
        }));
        mediaFiles.push(...videos);
      }

      //  Push each post as separate item (flat structure)
      if (mediaFiles.length > 0) {
        allPosts.push({
          alumId,
          postId,
          media: mediaFiles,
        });
      }
    });
  });

  //  Optional: latest posts first
  allPosts.sort((a, b) => Number(b.postId) - Number(a.postId));

  return res.status(200).json({
    success: 1,
    message: "All alumni posts fetched",
    count: allPosts.length,
    data: allPosts,
  });
};



const getAllAluminiEventsMedia = (req, res) => {
  try {
    const baseDir = path.join(EVENT_UPLOAD_DIR);

    if (!fs.existsSync(baseDir)) {
      return res.status(200).json({
        success: 2,
        message: "No event folders found",
        data: [],
      });
    }

    const alumIds = fs.readdirSync(baseDir);
    let allEvents = [];

    alumIds.forEach((alumId) => {
      const alumDir = path.join(baseDir, alumId);

      if (!fs.existsSync(alumDir) || !fs.statSync(alumDir).isDirectory()) return;

      const postIds = fs.readdirSync(alumDir);

      postIds.forEach((postId) => {
        const postDir = path.join(alumDir, postId);

        if (!fs.existsSync(postDir) || !fs.statSync(postDir).isDirectory()) return;

        const photosDir = path.join(postDir, "photos");
        const videosDir = path.join(postDir, "videos");

        let mediaFiles = [];

        // 📸 PHOTOS
        if (fs.existsSync(photosDir)) {
          const photos = fs.readdirSync(photosDir).map((file, index) => ({
            id: index + 1,
            filename: file,
            type: "image",
            url: `/uploads/alumini-events/${alumId}/${postId}/photos/${file}`,
          }));
          mediaFiles.push(...photos);
        }

        // 🎥 VIDEOS
        if (fs.existsSync(videosDir)) {
          const videos = fs.readdirSync(videosDir).map((file, index) => ({
            id: mediaFiles.length + index + 1,
            filename: file,
            type: "video",
            url: `/uploads/alumini-events/${alumId}/${postId}/videos/${file}`,
          }));
          mediaFiles.push(...videos);
        }

        // ✅ PUSH EVEN IF EMPTY (IMPORTANT)
        allEvents.push({
          alumId,
          postId,
          media: mediaFiles, // can be []
        });
      });
    });

    // ✅ SORT (latest first)
    allEvents.sort((a, b) => Number(b.postId) - Number(a.postId));

    return res.status(200).json({
      success: 1,
      message: "All alumni event media fetched",
      count: allEvents.length,
      data: allEvents,
    });

  } catch (error) {
    console.error("EVENT MEDIA ERROR:", error);

    return res.status(500).json({
      success: 0,
      message: "Server error while fetching event media",
      error: error.message,
    });
  }
};


const getAllAluminiEventDetail = (req, res) => {
  const { AlumId } = req.params;

  if (!AlumId) {
    return res.status(400).json({
      success: 0,
      message: "Alumni ID required",
    });
  }

  const baseDir = path.join(EVENT_UPLOAD_DIR, String(AlumId));

  if (!fs.existsSync(baseDir)) {
    return res.status(200).json({
      success: 2,
      message: "No events found",
      data: [],
    });
  }

  const eventIds = fs.readdirSync(baseDir);
  let allEvents = [];

  eventIds.forEach((eventId) => {
    const eventDir = path.join(baseDir, eventId);

    const photosDir = path.join(eventDir, "photos");
    const videosDir = path.join(eventDir, "videos");

    let mediaFiles = [];

    // 📸 PHOTOS
    if (fs.existsSync(photosDir)) {
      const photos = fs.readdirSync(photosDir).map((file, index) => ({
        id: index + 1,
        filename: file,
        type: "image",
        url: `/uploads/alumini-events/${AlumId}/${eventId}/photos/${file}`,
      }));

      mediaFiles = mediaFiles.concat(photos);
    }

    // 🎥 VIDEOS
    if (fs.existsSync(videosDir)) {
      const videos = fs.readdirSync(videosDir).map((file, index) => ({
        id: mediaFiles.length + index + 1,
        filename: file,
        type: "video",
        url: `/uploads/alumini-events/${AlumId}/${eventId}/videos/${file}`,
      }));

      mediaFiles = mediaFiles.concat(videos);
    }

    allEvents.push({
      eventId,
      media: mediaFiles,
    });
  });

  return res.status(200).json({
    success: 1,
    message: "Events fetched successfully",
    data: allEvents,
  });
};

/**
 * DELETE MEDIA FILE FOR A POST
 */
const deletePostMedia = (req, res) => {
  const { postId, filename, type } = req.body; // type = 'image' or 'video'

  if (!postId || !filename || !type) {
    return res.status(400).json({
      success: 0,
      message: "Post ID, filename, and type required",
    });
  }

  const filePath = path.join(
    POST_UPLOAD_DIR,
    String(postId),
    type === "video" ? "videos" : "photos",
    path.basename(filename),
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: 0, message: "File not found" });
  }

  fs.unlinkSync(filePath);
  return res
    .status(200)
    .json({ success: 1, message: "File deleted successfully" });
};

const getAluminiProfilePhoto = (req, res) => {
  const { AlumId } = req.params;

  if (!AlumId) {
    return res.status(400).json({
      success: 0,
      message: "Student ID required",
    });
  }

  const profileDir = path.join(
    ALUMINI_PROFILE_UPLOAD_DIR,
    String(AlumId),
    "profilephoto",
  );

  if (!fs.existsSync(profileDir)) {
    return res.status(200).json({
      success: 1,
      message: "No profile photo found",
      data: null,
    });
  }

  const files = fs.readdirSync(profileDir);

  if (files.length === 0) {
    return res.status(200).json({
      success: 1,
      message: "No profile photo found",
      data: null,
    });
  }

  // Get latest image (or first)
  const file = files[0];

  return res.status(200).json({
    success: 1,
    message: "Profile photo fetched",
    data: {
      filename: file,
      path: `/uploads/alumini-profiles/${AlumId}/profilephoto/${file}`,
    },
  });
};

module.exports = {
  uploadAluminiPostMedia,
  getAllAlumniniPostDetail,
  deletePostMedia,
  uploadAluminiEventMedia,
  getAllAluminiEventDetail,
  uploadAluminiProfilePicture,
  getAluminiProfilePhoto,
  getFullpostMediaDetail,
  getAllAluminiEventsMedia
};
