import * as Yup from "yup";
const schema = Yup.object().shape({
  networkDetails: Yup.mixed().required("Newtork Name Required"),
  // from Name
  fromName: Yup.array().test(
    "fromName",
    "From Name Required",
    function (value) {
      const fromNameDate = this.parent.fromNameDate;
      if (
        fromNameDate !== null &&
        fromNameDate !== undefined &&
        fromNameDate !== ""
      ) {
        return (
          value &&
          value.length > 0 &&
          value[0] !== undefined &&
          value[0] !== null &&
          value[0] !== ""
        );
      }
      return true;
    }
  ),
  fromNameDate: Yup.date()
    .test("fromNameDate", "Date Required", function (value) {
      const fromName = this.parent.fromName;
      if (
        fromName &&
        fromName.length > 0 &&
        fromName[0] !== undefined &&
        fromName[0] !== null &&
        fromName[0] !== ""
      ) {
        return value !== undefined && value !== null;
      }
      return true;
    })
    .nullable(),
  fromNameCheckBox: Yup.boolean(),
  // subject Line
  subjectLine: Yup.array().test(
    "subjectLine",
    "From Name Required",
    function (value) {
      const subjectLineDate = this.parent.subjectLineDate;
      if (
        subjectLineDate !== null &&
        subjectLineDate !== undefined &&
        subjectLineDate !== ""
      ) {
        return (
          value &&
          value.length > 0 &&
          value[0] !== undefined &&
          value[0] !== null &&
          value[0] !== ""
        );
      }
      return true;
    }
  ),
  subjectLineDate: Yup.date()
    .test("subjectLineDate", "Date Required", function (value) {
      const subjectLine = this.parent.subjectLine;
      if (
        subjectLine &&
        subjectLine.length > 0 &&
        subjectLine[0] !== undefined &&
        subjectLine[0] !== null &&
        subjectLine[0] !== ""
      ) {
        return value !== undefined && value !== null;
      }
      return true;
    })
    .nullable(),
  subjectLineCheckBox: Yup.boolean(),
  //restricted Word
  restrictedWord: Yup.array().test(
    "restrictedWord",
    "Restricted Word Required",
    function (value) {
      const restrictedWordDate = this.parent.restrictedWordDate;
      if (
        restrictedWordDate !== null &&
        restrictedWordDate !== undefined &&
        restrictedWordDate !== ""
      ) {
        return (
          value &&
          value.length > 0 &&
          value[0] !== undefined &&
          value[0] !== null &&
          value[0] !== ""
        );
      }
      return true;
    }
  ),
  restrictedWordDate: Yup.date()
    .test("restrictedWordDate", "Date Required", function (value) {
      const restrictedWord = this.parent.restrictedWord;
      if (
        restrictedWord &&
        restrictedWord.length > 0 &&
        restrictedWord[0] !== undefined &&
        restrictedWord[0] !== null &&
        restrictedWord[0] !== ""
      ) {
        return value !== undefined && value !== null;
      }
      return true;
    })
    .nullable(),
  restrictedWordCheckBox: Yup.boolean(),
  // warning Word
  warningWord: Yup.array().test(
    "warningWord",
    "warning  Word Required",
    function (value) {
      const warningWordDate = this.parent.warningWordDate;
      if (
        warningWordDate !== null &&
        warningWordDate !== undefined &&
        warningWordDate !== ""
      ) {
        return (
          value &&
          value.length > 0 &&
          value[0] !== undefined &&
          value[0] !== null &&
          value[0] !== ""
        );
      }
      return true;
    }
  ),
  warningWordDate: Yup.date()
    .test("warningWordDate", "Date Required", function (value) {
      const warningWord = this.parent.warningWord;
      if (
        warningWord &&
        warningWord.length > 0 &&
        warningWord[0] !== undefined &&
        warningWord[0] !== null &&
        warningWord[0] !== ""
      ) {
        return value !== undefined && value !== null;
      }
      return true;
    })
    .nullable(),
  warningWordCheckBox: Yup.boolean(),
  // seasonal From Name
  seasonalFromName: Yup.array().test(
    "seasonalFromName",
    "seasonal From Name Required",
    function (value) {
      const seasonalFromNameDate = this.parent.seasonalFromNameDate;
      if (
        seasonalFromNameDate !== null &&
        seasonalFromNameDate !== undefined &&
        seasonalFromNameDate !== ""
      ) {
        return (
          value &&
          value.length > 0 &&
          value[0] !== undefined &&
          value[0] !== null &&
          value[0] !== ""
        );
      }
      return true;
    }
  ),
  seasonalFromNameDate: Yup.date()
    .test("seasonalFromNameDate", "Date Required", function (value) {
      const seasonalFromName = this.parent.seasonalFromName;
      if (
        seasonalFromName &&
        seasonalFromName.length > 0 &&
        seasonalFromName[0] !== undefined &&
        seasonalFromName[0] !== null &&
        seasonalFromName[0] !== ""
      ) {
        return value !== undefined && value !== null;
      }
      return true;
    })
    .nullable(),
  seasonalFromNameCheckBox: Yup.boolean(),
  // seasonal Subject Line
  seasonalSubjectLine: Yup.array().test(
    "seasonalSubjectLine",
    "seasonal Subject Line Required",
    function (value) {
      const seasonalSubjectLineDate = this.parent.seasonalSubjectLineDate;
      if (
        seasonalSubjectLineDate !== null &&
        seasonalSubjectLineDate !== undefined &&
        seasonalSubjectLineDate !== ""
      ) {
        return (
          value &&
          value.length > 0 &&
          value[0] !== undefined &&
          value[0] !== null &&
          value[0] !== ""
        );
      }
      return true;
    }
  ),
  seasonalSubjectLineDate: Yup.date()
    .test("seasonalSubjectLineDate", "Date Required", function (value) {
      const seasonalSubjectLine = this.parent.seasonalSubjectLine;
      if (
        seasonalSubjectLine &&
        seasonalSubjectLine.length > 0 &&
        seasonalSubjectLine[0] !== undefined &&
        seasonalSubjectLine[0] !== null &&
        seasonalSubjectLine[0] !== ""
      ) {
        return value !== undefined && value !== null;
      }
      return true;
    })
    .nullable(),
  seasonalSubjectLineCheckBox: Yup.boolean(),
  // spam Word
  spamWord: Yup.array().test(
    "spamWord",
    "Spam Word Required",
    function (value) {
      const spamWordDate = this.parent.spamWordDate;
      if (
        spamWordDate !== null &&
        spamWordDate !== undefined &&
        spamWordDate !== ""
      ) {
        return (
          value &&
          value.length > 0 &&
          value[0] !== undefined &&
          value[0] !== null &&
          value[0] !== ""
        );
      }
      return true;
    }
  ),
  spamWordDate: Yup.date()
    .test("spamWordDate", "Date Required", function (value) {
      const spamWord = this.parent.spamWord;
      if (
        spamWord &&
        spamWord.length > 0 &&
        spamWord[0] !== undefined &&
        spamWord[0] !== null &&
        spamWord[0] !== ""
      ) {
        return value !== undefined && value !== null;
      }
      return true;
    })
    .nullable(),
  spamWordCheckBox: Yup.boolean(),
  // Footer
  footer: Yup.array().test("footer", "Footer  Required", function (value) {
    const footerDate = this.parent.footerDate;
    if (footerDate !== null && footerDate !== undefined && footerDate !== "") {
      return (
        value &&
        value.length > 0 &&
        value[0] !== undefined &&
        value[0] !== null &&
        value[0] !== ""
      );
    }
    return true;
  }),
  footerDate: Yup.date()
    .test("footerDate", "Date Required", function (value) {
      const footer = this.parent.footer;
      if (
        footer &&
        footer.length > 0 &&
        footer[0] !== undefined &&
        footer[0] !== null &&
        footer[0] !== ""
      ) {
        return value !== undefined && value !== null;
      }
      return true;
    })
    .nullable(),
  footerCheckBox: Yup.boolean(),
});
export default schema;
