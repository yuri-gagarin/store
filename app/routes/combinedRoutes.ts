import { Router } from "express";
// routes imports //
import testRoute from "./testRoute";

export default function (router: Router): void {
  testRoute(router);
}