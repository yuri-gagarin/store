import { Router } from "express";

export default function (router: Router): void {
  router
    .route("/api/test")
    .get((req, res) => {
      res.json({
        message: "successful test route",
        data: {
          junk: "Some junk data here"
        }
      });
    });
}
