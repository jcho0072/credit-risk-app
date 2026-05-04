import {getApplications} from "./src/api/applications.js";

async function test(){
    try {
        const data = await getApplications();
        console.log("SUCCESS", data)
    } catch (err) {
        console.error("ERROR:", err.message);
    }
}

test();