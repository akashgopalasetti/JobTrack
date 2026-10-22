import mongoose from 'mongoose';

export const STATUS_ENUM = [
  'Applied',
  'Interview',
  'Assessment',
  'Offer',
  'Rejected',
  'Saved'
];

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const applicationSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company Name is required'],
      trim: true,
      maxlength: [100, 'Company Name cannot exceed 100 characters']
    },
    jobTitle: {
      type: String,
      required: [true, 'Job Title is required'],
      trim: true,
      maxlength: [100, 'Job Title cannot exceed 100 characters']
    },
    status: {
      type: String,
      enum: {
        values: STATUS_ENUM,
        message: '{VALUE} is not a valid job status. Allowed values: ' + STATUS_ENUM.join(', ')
      },
      default: 'Applied',
      required: [true, 'Job Status is required']
    },
    location: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    jobPostingUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function (v) {
          if (!v || v.trim() === '') return true;
          return urlRegex.test(v);
        },
        message: 'Job Posting URL must be a valid web address'
      }
    },
    resumeName: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Resume Name cannot exceed 100 characters']
    },
    resumeLink: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function (v) {
          if (!v || v.trim() === '') return true;
          return urlRegex.test(v);
        },
        message: 'Resume Link must be a valid web address'
      }
    },
    appliedEmail: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function (v) {
          if (!v || v.trim() === '') return true;
          return emailRegex.test(v);
        },
        message: 'Applied Email must be a valid email address'
      }
    },
    recruiterName: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Recruiter / Contact Person cannot exceed 100 characters']
    },
    followUpDate: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters']
    }
  },
  {
    timestamps: true
  }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
