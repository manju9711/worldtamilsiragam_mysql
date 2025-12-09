const TAMIL_MESSAGE = {
  CREATE_SUCC: "வெற்றிகரமாக உருவாக்கியது",
  CREATE_FAIL: "உருவாக்க முடியவில்லை",
  UPDATE_SUCC: "வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
  UPDATE_FAIL: "புதுப்பிக்க முடியவில்லை",
  DELETE_SUCC: "வெற்றிகரமாக நீக்கப்பட்டது",
  DELETE_FAIL: "நீக்க முடியவில்லை",
  GET_SUCC: "வெற்றிகரமாக பெற்றது",
  GET_FAIL: "பெற முடியவில்லை",
  GET_BY_ID_SUCC: "ID மூலம் வெற்றிகரமாக பெற்றது",
  GET_BY_ID_FAIL: "ID மூலம் பெற முடியவில்லை"
};

const ENGLISH_MESSAGE = {
  CREATE_SUCC: "Created Successfully",
  CREATE_FAIL: "Fail to Create",
  UPDATE_SUCC: "Updated Successfully",
  UPDATE_FAIL: "Fail to Update",
  DELETE_SUCC: "Deleted Successfully",
  DELETE_FAIL: "Fail to Delete",
  GET_SUCC: "Fetched Successfully",
  GET_FAIL: "Fail to Fetch",
  GET_BY_ID_SUCC: "Fetched by ID Successfully",
  GET_BY_ID_FAIL: "Fail to Fetch by ID"
};

const STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500
};

const FILE_UPLOAD = {
  UPLOAD_ERROR:  "Error uploading file"
};

const CONTACT_FORM = {
  SUCCESS : "Contact User Added Successfully",
  RETRIVE_ERROR : "An error occurred while retrieving contact forms",
  NOT_FOUND : "Contact form not found",
  UPDATE_ERROR : "An error occurred while updating the contact form"
};

const TeamTypeEnum ={
  ADMIN_TEAM: "நிர்வாக குழு",
  SUBCOMMITTEE_MEMBERS: "செயற்குழு உறுப்பினர்கள்",
};

const GenderEnum ={
  MALE: "Male",
  FEMALE: "Female"
};

const MemberTypeEnum ={
  DIRECTORS: "இயக்குனர்கள் / Directors",
  ADVISORS: "ஆலோசகர்கள் / Advisors",
  LIFETIME_MEMBERSHIP: "ஆயுட்கால உறுப்பினர்கள் / Lifetime membership",
  MEMBERSHIP: "உறுப்பினர்கள் / Membership"
};

module.exports = { 
  TAMIL_MESSAGE, 
  ENGLISH_MESSAGE, 
  STATUS_CODES, 
  FILE_UPLOAD, 
  CONTACT_FORM, 
  TeamTypeEnum, 
  GenderEnum, 
  MemberTypeEnum 
};


