import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  segment_type: Yup.mixed().required("Segment Type  Required"),
  segment_name: Yup.mixed().required("Segment Name  Required"),
  description: Yup.mixed().required("Description  Required"),
  segmentCategory: Yup.mixed().required("Segment Category  Required"),
  list_id: Yup.mixed().when("segment_type", {
    is: "List",
    then: Yup.mixed().required("List Name  Required"),
  }),
  offer_id: Yup.mixed().when("segment_type", {
    is: "Offer",
    then: Yup.mixed().required("Offer Name  Required"),
  }),

  main: Yup.array().of(
    Yup.object().shape({
      type: Yup.number().required("Type  Required"),
      operator: Yup.mixed().when("type", {
        is: 1,
        then: Yup.object().required("Match key  Required"),
      }),
      operand: Yup.mixed().when("type", {
        is: 1,
        then: Yup.mixed().required("Match value  Required"),
      }),

      // time_range: Yup.mixed().when("type", {
      //   is: 2,
      //   then: Yup.mixed().required("Time Range is required"),
      // }),
      time_range: Yup.mixed().when("type", {
        is: 2,
        then: Yup.object({
          value: Yup.string().required("Time Range  Required"),
        }),
      }),
      from_date: Yup.mixed().when(["type", "time_range"], {
        is: (type, time_range) => type === 2 && time_range?.label === "Custom",
        then: Yup.mixed().required("From Date  Required"),
      }),
      to_date: Yup.mixed().when(["type", "time_range"], {
        is: (type, time_range) => type === 2 && time_range?.label === "Custom",
        then: Yup.mixed().required("To Date  Required"),
      }),

      slot: Yup.mixed().when(["type", "time_range"], {
        is: (type, time_range) =>
          type === 2 &&
          (time_range?.label === "Less Than" ||
            time_range?.label === "Between" ||
            time_range?.label === "Less Than/Equal To" ||
            time_range?.label === "More Than" ||
            time_range?.label === "More Than/Equal To"),
        then: Yup.mixed().required("Slot  Required"),
      }),
      from: Yup.mixed().when(["type", "time_range"], {
        is: (type, time_range) =>
          type === 2 &&
          (time_range.label === "Less Than" ||
            time_range.label === "Between" ||
            time_range.label === "Less Than/Equal To" ||
            time_range.label === "More Than" ||
            time_range.label === "More Than/Equal To"),
        then: Yup.mixed().required("Count  Required"),
      }),
      to: Yup.mixed().when(["type", "time_range"], {
        is: (type, time_range) => type === 2 && time_range.label === "Between",
        then: Yup.mixed().required("Count  Required"),
      }),
      to_slot: Yup.mixed().when(["type", "time_range"], {
        is: (type, time_range) => type === 2 && time_range.label === "Between",
        then: Yup.mixed().required("To Slot  Required"),
      }),
      operatorSystemField: Yup.mixed().when(["abs", "type"], {
        is: (abs, type) => (abs == 1 || abs == 2) && type == 3,
        then: Yup.mixed().required("Behaviour  Required"),
        otherwise: Yup.mixed(),
      }),
      abs_date_value: Yup.mixed().when(["abs", "type"], {
        is: (abs, type) => abs == 1 && type == 3,
        then: Yup.mixed().required("From date  Required"),
      }),
      date_relative_value: Yup.mixed().when(["abs", "type"], {
        is: (abs, type) => abs == 2 && type == 3,
        then: Yup.mixed().required("Counts  Required"),
      }),
      number_of_time: Yup.boolean(),
      repeat_operator: Yup.mixed().when("number_of_time", {
        is: true,
        then: Yup.mixed().required("Field Is Required"),
      }),
      repeat_from: Yup.mixed().when("number_of_time", {
        is: true,
        then: Yup.number()
          .required("Field Is Required")
          .min(1, "Field must be at least 1"),
      }),

      date_relative_type: Yup.mixed().when(["abs", "type"], {
        is: (abs, type) => abs == 2 && type == 3,
        then: Yup.mixed().required("Slot  Required"),
      }),
    })
  ),
});
export default validationSchema;
