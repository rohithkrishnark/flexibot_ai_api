const fs = require("fs");
const path = require("path");
const POST_UPLOAD_DIR = "C:/uploads/student-posts";
const ACTIVITY_UPLOAD_DIR = "C:/uploads/student-activity";
const PROFILE_UPLOAD_DIR = "C:/uploads/student-profile";
const BASE_UPLOAD_DIR = "C:/uploads/faculity-document";

/**
 * UPLOAD POST MEDIA (IMAGE/VIDEO)
 */
const uploadPostMedia = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }

  const mediaType = req.file.mimetype.split("/")[0]; // "image" or "video"
  const { postId, std_id } = req.body; // include student id

  if (!postId || !std_id) {
    return res
      .status(400)
      .json({ success: 0, message: "Post ID and Student ID required" });
  }

  // Create student folder if not exists
  const studentDir = path.join(POST_UPLOAD_DIR, String(std_id));
  if (!fs.existsSync(studentDir)) fs.mkdirSync(studentDir, { recursive: true });

  // Create post folder inside student folder
  const postDir = path.join(studentDir, String(postId));
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  // Create photos or videos folder inside post folder
  const mediaDir = path.join(
    postDir,
    mediaType === "video" ? "videos" : "photos",
  );
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  // Move file from temp upload folder to correct media folder
  const destPath = path.join(mediaDir, req.file.filename);
  fs.renameSync(req.file.path, destPath);

  const fileInfo = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    type: mediaType,
    path: destPath,
  };

  return res.status(200).json({
    success: 1,
    message: "Media uploaded successfully",
    data: fileInfo,
  });
};

const uploadStudentActivity = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }

  const mediaType = req.file.mimetype.split("/")[0]; // e.g., "image" or "video"

  // Only allow images
  if (mediaType !== "image") {
    // Delete temp file if it's not an image
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res
      .status(400)
      .json({ success: 0, message: "Only image uploads are allowed" });
  }

  const { activity_id, student_id } = req.body; // include student id
  if (!activity_id || !student_id) {
    return res
      .status(400)
      .json({ success: 0, message: "Activity ID and Student ID required" });
  }

  // Create student folder if not exists
  const studentDir = path.join(ACTIVITY_UPLOAD_DIR, String(student_id));
  if (!fs.existsSync(studentDir)) fs.mkdirSync(studentDir, { recursive: true });

  // Create post folder inside student folder
  const postDir = path.join(studentDir, String(activity_id));
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  // Create photos folder (only)
  const mediaDir = path.join(postDir, "photos");
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  // Move file from temp upload folder to correct folder
  const destPath = path.join(mediaDir, req.file.filename);
  fs.renameSync(req.file.path, destPath);

  const fileInfo = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    type: mediaType,
    path: destPath,
  };

  return res.status(200).json({
    success: 1,
    message: "Image uploaded successfully",
    data: fileInfo,
  });
};

const uploadProfilePicture = (req, res) => {
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

  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ success: 0, message: "Student ID required" });
  }

  // /uploads/profile/<student_id>/profilephoto/
  const studentDir = path.join(PROFILE_UPLOAD_DIR, String(student_id));
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
      path: `/uploads/profile/${student_id}/profilephoto/${req.file.filename}`,
    },
  });
};
/**
 * GET MEDIA FILES FOR A POST
 */
const getPostMedia = (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ success: 0, message: "Post ID required" });
  }

  const postDir = path.join(POST_UPLOAD_DIR, String(postId));
  const photosDir = path.join(postDir, "photos");
  const videosDir = path.join(postDir, "videos");

  let mediaFiles = [];

  // Read photos
  if (fs.existsSync(photosDir)) {
    const photos = fs.readdirSync(photosDir).map((file, index) => ({
      id: mediaFiles.length + index + 1,
      filename: file,
      type: "image",
    }));
    mediaFiles = mediaFiles.concat(photos);
  }

  // Read videos
  if (fs.existsSync(videosDir)) {
    const videos = fs.readdirSync(videosDir).map((file, index) => ({
      id: mediaFiles.length + index + 1,
      filename: file,
      type: "video",
    }));
    mediaFiles = mediaFiles.concat(videos);
  }

  if (mediaFiles.length === 0) {
    return res.status(200).json({
      success: 2,
      message: "No media files found",
      data: [],
    });
  }

  return res.status(200).json({
    success: 1,
    message: "Media files fetched successfully",
    data: mediaFiles,
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

const getAllStudentPostDetail = (req, res) => {
  const { StdId } = req.params;

  if (!StdId) {
    return res.status(400).json({ success: 0, message: "Student ID required" });
  }

  const studentDir = path.join(POST_UPLOAD_DIR, String(StdId));

  // If student folder doesn't exist, return empty array
  if (!fs.existsSync(studentDir)) {
    return res
      .status(200)
      .json({ success: 1, message: "No posts found", data: [] });
  }

  // Each post is a folder inside the student's folder
  const postFolders = fs
    .readdirSync(studentDir)
    .filter((f) => fs.statSync(path.join(studentDir, f)).isDirectory());

  let allPosts = [];

  postFolders.forEach((postId) => {
    const postDir = path.join(studentDir, postId);
    const photosDir = path.join(postDir, "photos");
    const videosDir = path.join(postDir, "videos");

    let mediaFiles = [];

    // Read photos
    if (fs.existsSync(photosDir)) {
      const photos = fs.readdirSync(photosDir).map((file) => ({
        type: "image",
        filename: file,
        path: `/uploads/student-posts/${StdId}/${postId}/photos/${file}`,
      }));
      mediaFiles = mediaFiles.concat(photos);
    }

    // Read videos
    if (fs.existsSync(videosDir)) {
      const videos = fs.readdirSync(videosDir).map((file) => ({
        type: "video",
        filename: file,
        path: `/uploads/student-posts/${StdId}/${postId}/videos/${file}`,
      }));
      mediaFiles = mediaFiles.concat(videos);
    }

    allPosts.push({
      id: Number(postId),
      caption: `Post ${postId}`, // You can replace this with a caption stored in DB
      media: mediaFiles,
    });
  });

  return res.status(200).json({
    success: 1,
    message: "All posts with media fetched successfully",
    data: allPosts,
  });
};

const getAllStudentActivities = (req, res) => {
  const { StdId } = req.params;

  if (!StdId) {
    return res.status(400).json({ success: 0, message: "Student ID required" });
  }

  const studentDir = path.join(ACTIVITY_UPLOAD_DIR, String(StdId));

  // If student folder doesn't exist, return empty array
  if (!fs.existsSync(studentDir)) {
    return res
      .status(200)
      .json({ success: 1, message: "No posts found", data: [] });
  }

  // Each post is a folder inside the student's folder
  const postFolders = fs
    .readdirSync(studentDir)
    .filter((f) => fs.statSync(path.join(studentDir, f)).isDirectory());

  let allPosts = [];

  postFolders.forEach((postId) => {
    const postDir = path.join(studentDir, postId);
    const photosDir = path.join(postDir, "photos");
    const videosDir = path.join(postDir, "videos");

    let mediaFiles = [];

    // Read photos
    if (fs.existsSync(photosDir)) {
      const photos = fs.readdirSync(photosDir).map((file) => ({
        type: "image",
        filename: file,
        path: `/uploads/student-activity/${StdId}/${postId}/photos/${file}`,
      }));
      mediaFiles = mediaFiles.concat(photos);
    }

    // Read videos
    if (fs.existsSync(videosDir)) {
      const videos = fs.readdirSync(videosDir).map((file) => ({
        type: "video",
        filename: file,
        path: `/uploads/student-activity/${StdId}/${postId}/videos/${file}`,
      }));
      mediaFiles = mediaFiles.concat(videos);
    }

    allPosts.push({
      id: Number(postId),
      caption: `Post ${postId}`, // You can replace this with a caption stored in DB
      media: mediaFiles,
    });
  });

  return res.status(200).json({
    success: 1,
    message: "All posts with media fetched successfully",
    data: allPosts,
  });
};

const getMyProfilePhoto = (req, res) => {
  const { StdId } = req.params;

  if (!StdId) {
    return res.status(400).json({
      success: 0,
      message: "Student ID required",
    });
  }

  const profileDir = path.join(
    PROFILE_UPLOAD_DIR,
    String(StdId),
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
      path: `/uploads/student-profile/${StdId}/profilephoto/${file}`,
    },
  });
};

const getFaculityDocumentsByFaculty = (req, res) => {
  try {
    const { faculty_id } = req.params;

    if (!faculty_id) {
      return res.status(400).json({
        success: 0,
        message: "faculty_id is required",
      });
    }

    const facultyDir = path.join(BASE_UPLOAD_DIR, String(faculty_id));

    // ❌ If no folder
    if (!fs.existsSync(facultyDir)) {
      return res.status(200).json({
        success: 1,
        message: "No documents found",
        data: [],
      });
    }

    let allDocuments = [];

    // 🔁 Loop departments
    const departmentFolders = fs
      .readdirSync(facultyDir)
      .filter((f) => fs.statSync(path.join(facultyDir, f)).isDirectory());

    departmentFolders.forEach((depId) => {
      const depDir = path.join(facultyDir, depId);

      //  Loop documents
      const documentFolders = fs
        .readdirSync(depDir)
        .filter((f) => fs.statSync(path.join(depDir, f)).isDirectory());

      documentFolders.forEach((docId) => {
        const docDir = path.join(depDir, docId);

        const files = fs.readdirSync(docDir).map((file) => ({
          type: "pdf",
          filename: file,
          path: `/uploads/faculity-document/${faculty_id}/${depId}/${docId}/${file}`,
        }));

        allDocuments.push({
          department_id: Number(depId),
          document_id: Number(docId),
          files,
        });
      });
    });

    return res.status(200).json({
      success: 1,
      message: "All faculty documents fetched",
      data: allDocuments,
    });
  } catch (error) {
    console.error("getFaculityDocumentsByFaculty error:", error);
    return res.status(500).json({
      success: 0,
      message: "Something went wrong",
    });
  }
};

const getAllFaculityDocuemntDetailByDep = (req, res) => {
  try {
    const { depid } = req.params;

    if (!depid) {
      return res.status(400).json({
        success: 0,
        message: "depid is required",
      });
    }

    if (!fs.existsSync(BASE_UPLOAD_DIR)) {
      return res.status(200).json({
        success: 1,
        message: "No documents found",
        data: [],
      });
    }

    let allDocuments = [];

    const facultyFolders = fs
      .readdirSync(BASE_UPLOAD_DIR)
      .filter((f) => fs.statSync(path.join(BASE_UPLOAD_DIR, f)).isDirectory());

    facultyFolders.forEach((faculty_id) => {
      const depDir = path.join(BASE_UPLOAD_DIR, faculty_id, depid);

      if (!fs.existsSync(depDir)) return;

      const documentFolders = fs
        .readdirSync(depDir)
        .filter((f) => fs.statSync(path.join(depDir, f)).isDirectory());

      documentFolders.forEach((docId) => {
        const docDir = path.join(depDir, docId);

        const files = fs.readdirSync(docDir).map((file) => ({
          type: "pdf",
          filename: file,
          path: `/uploads/faculity-document/${faculty_id}/${depid}/${docId}/${file}`,
        }));

        allDocuments.push({
          faculty_id: Number(faculty_id),
          department_id: Number(depid),
          document_id: Number(docId),
          files,
        });
      });
    });

    return res.status(200).json({
      success: 1,
      message: "Department documents fetched",
      data: allDocuments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      message: "Something went wrong",
    });
  }
};
const getAllStudentsActivities = (req, res) => {
  const baseDir = path.join(ACTIVITY_UPLOAD_DIR);

  // If no activity folder exists
  if (!fs.existsSync(baseDir)) {
    return res.status(200).json({
      success: 1,
      message: "No activity found",
      data: [],
    });
  }

  const studentFolders = fs
    .readdirSync(baseDir)
    .filter((f) => fs.statSync(path.join(baseDir, f)).isDirectory());

  let allPosts = [];

  // 🔥 LOOP ALL STUDENTS
  studentFolders.forEach((StdId) => {
    const studentDir = path.join(baseDir, StdId);

    const postFolders = fs
      .readdirSync(studentDir)
      .filter((f) => fs.statSync(path.join(studentDir, f)).isDirectory());

    // 🔥 LOOP POSTS
    postFolders.forEach((postId) => {
      const postDir = path.join(studentDir, postId);
      const photosDir = path.join(postDir, "photos");
      const videosDir = path.join(postDir, "videos");

      let mediaFiles = [];

      // 📸 Photos
      if (fs.existsSync(photosDir)) {
        const photos = fs.readdirSync(photosDir).map((file, index) => ({
          id: index + 1,
          type: "image",
          filename: file,
          url: `/uploads/student-activity/${StdId}/${postId}/photos/${file}`,
        }));
        mediaFiles.push(...photos);
      }

      // 🎥 Videos
      if (fs.existsSync(videosDir)) {
        const videos = fs.readdirSync(videosDir).map((file, index) => ({
          id: mediaFiles.length + index + 1,
          type: "video",
          filename: file,
          url: `/uploads/student-activity/${StdId}/${postId}/videos/${file}`,
        }));
        mediaFiles.push(...videos);
      }

      // ✅ PUSH WITH STUDENT INFO
      allPosts.push({
        stdId: Number(StdId),
        postId: Number(postId),
        caption: `Post ${postId}`,
        media: mediaFiles,
      });
    });
  });

  // 🔥 SORT LATEST FIRST
  allPosts.sort((a, b) => b.postId - a.postId);

  return res.status(200).json({
    success: 1,
    message: "All student activities fetched",
    count: allPosts.length,
    data: allPosts,
  });
};

module.exports = {
  uploadPostMedia,
  getPostMedia,
  deletePostMedia,
  getAllStudentPostDetail,
  uploadStudentActivity,
  getAllStudentActivities,
  uploadProfilePicture,
  getMyProfilePhoto,
  getAllStudentsActivities,
  getFaculityDocumentsByFaculty,
  getAllFaculityDocuemntDetailByDep,
};
