import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(
    "http://localhost:3000/api/v1/clips",

    () => {
      return HttpResponse.json({
        clips: [
          {
            _id: "1",

            gameName: "Valorant",

            caption: "Clutch Ace",
            description: "Clutch Ace",
          },
        ],
      });
    },
  ),

  http.post(
    "http://localhost:3000/api/v1/auth/user/login",

    async () => {
      return HttpResponse.json({
        success: true,

        user: {
          _id: "1",

          fullName: "Aditya",
        },
      });
    },
  ),
];
