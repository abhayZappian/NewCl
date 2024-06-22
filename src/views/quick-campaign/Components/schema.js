import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  campaignName: Yup.string().required("Campaign Name Required"),
  suppressionListId: Yup.array()
    .required("Suppression List Required")
    .min(1, "Min one Suppression List Required"),
  offerId: Yup.mixed().required("Offer ID Required"),
  offerLink: Yup.mixed().required("Offer Link Required"),
  emailServiceType: Yup.string().required(
    "Please select an Email Service Type"
  ),
  breakActionCount: Yup.number()
    .min(100, "minimum value should be 100")
    .test(
      "break-action-count",
      "Take a pause during the running campaign for and seconds after each email is sent. must be filled",
      function (value) {
        const breakActionTime = this.parent.breakActionTime;
        if (
          (value === null || value === undefined || value === "") &&
          (breakActionTime === null ||
            breakActionTime === undefined ||
            breakActionTime === "")
        ) {
          return true;
        } else if (value && breakActionTime) {
          return true;
        } else {
          return false;
        }
      }
    ),
  breakActionTime: Yup.number()
    .max(5, "please enter value between 1 to 5")
    .min(1, "please enter value between 1 to 5"),
  espName: Yup.mixed().when("emailServiceType", {
    is: "esp",
    then: Yup.mixed().required("ESP Name Required"),
    otherwise: Yup.mixed(),
  }),
  emailServiceAccount: Yup.mixed().when("emailServiceType", {
    is: "esp",
    then: Yup.mixed().required("Email Service Account Required"),
    otherwise: Yup.mixed(),
  }),
  groupSmtpList: Yup.mixed().when("emailServiceType", {
    is: "groupSMTP",
    then: Yup.mixed().required("SMTP List Required "),
    otherwise: Yup.mixed(),
  }),
  htmlCode: Yup.mixed().required("Template content Required"),
  groupSmtpServerName: Yup.mixed().when("emailServiceType", {
    is: "groupSMTP",
    then: Yup.mixed().required("Server Name Required "),
    otherwise: Yup.mixed(),
  }),
  smtpEmailServiceAccount: Yup.mixed().when("emailServiceType", {
    is: "smtp",
    then: Yup.mixed().required("SMTP List Required "),
    otherwise: Yup.mixed(),
  }),
  fromName: Yup.string().required("From name Required"),
  subjectLine: Yup.string().required("Subject Line Required"),
  fromDomain: Yup.string().required("From Domain Required"),
  replyTo: Yup.string().required("ReplyTo Required"),
  listId: Yup.array().required("List Required").min(1, "Min one list Required"),

  acknowledgmentAfterCount: Yup.number()
    .nullable()
    .test(
      "acknowledgment-after-count",
      "Acknowledgment After Count and Acknowledgment Email must be filled",
      function (value) {
        const acknowledgmentEmail = this.parent.acknowledgmentEmail;
        if (
          (value === null || value === undefined || value === "") &&
          (acknowledgmentEmail === null ||
            acknowledgmentEmail === undefined ||
            acknowledgmentEmail === "")
        ) {
          return true;
        } else if (value && acknowledgmentEmail) {
          return true;
        } else {
          return false;
        }
      }
    ),
  acknowledgmentEmail: Yup.string().matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Invalid email format"
  ),
  timezone: Yup.mixed().required("Time Zone Required"),
  scheduleDate: Yup.date().when("scheduleType", {
    is: "schedularLater",
    then: Yup.date().required("Schedule date Required"),
    otherwise: Yup.date(),
  }),
  scheduleStartTime: Yup.mixed().when("scheduleType", {
    is: "schedularLater",
    then: Yup.mixed().required("Schedule time Required"),
    otherwise: Yup.mixed(),
  }),
});

export const validationSchemaTest = Yup.object().shape({
  campaignName: Yup.string().required("Campaign Name Required"),
  offerId: Yup.mixed().required("Offer ID Required"),
  espName: Yup.mixed().required("Esp Name Required"),
  emailServiceAccount: Yup.mixed().required("email Service Account Required"),
  // templateList: Yup.mixed().required('Template List is required'),
  fromName: Yup.mixed().required("From Name Required"),
  subjectLine: Yup.mixed().required("Subject Line Required"),
  fromDomain: Yup.mixed().required("From Domain Required"),
  replyTo: Yup.mixed().required("Reply To Required"),
  htmlCode: Yup.mixed().required("Template content Required"),
  suppression: Yup.array()
    .min(1, "Select at least one Suppresion")
    .of(Yup.mixed().required("Multi-Select is required")),
  // emails: Yup.string()
  //   .test('is-required', 'Email Required', function (value) {
  //     const { sendEmailType } = this.parent;
  //     if (sendEmailType === 'campaign' && !value) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   })
  //   .nullable()
  emails: Yup.mixed().required("Email required"),
});
