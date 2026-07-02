let axios = require("axios");

var data = {
//   template_id: "14fc559f-d591-42b0-a095-05b292ab9a35",
  template_id: "8e9c8d77-2799-435a-b146-47db3406494f",
  email_configuration_id: "92616a7f-cbf2-490f-99f2-ff5baf67e97d",
  api_key: "TLavjjNdBWAGqRXvgCTNwIHkrKyEfJdkyOeEyEkiKQPYIuLagVRUVqzIyjxZbw",
  email: "davidhustler78@gmail.com",
  subject: "Your daily blog",
  variables: {
    first_name: "Adebayo",
    post_title: "Daily blog",
    post_excerpt: "This is the daily blog post",
    post_url: "{{post_url}}",
    post_category: "",
    post_image: "",

    read_time: "{{read_time}}",
  },
//   unsubscribe_url: "",
};

var data = JSON.stringify(data);

axios({
  method: "post",
  url: "https://v3.api.termii.com/api/templates/send-email",
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
})
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

// xhr.addEventListener("readystatechange", function() {
// if(this.readyState === 4) {
//   console.log(this.responseText);
// }
// });

// xhr.open("POST", "https://BASE_UR/api/templates/send-email");
// xhr.setRequestHeader("Content-Type", "application/json");
// xhr.setRequestHeader("Content-Type", "application/json");
// xhr.send(data);