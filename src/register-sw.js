import { register } from "register-service-worker"

register(`${process.env.BASE_URL}sw.js`)
